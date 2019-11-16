import express from 'express';
import status from 'http-status';
import * as pollSchema from '../schema/poll.schema';
import redis from 'redis';
import { Poll } from '../models/poll.model';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { Participant } from '../models/participants.model';
import { getNewCode } from '../util/code.generator';
import passport from 'passport';
import { upload } from '../datastores/storage';
const client = redis.createClient();
const router = express.Router();

router.get('/polls', (_req, res) => {
	Poll.findAll()
		.then((polls) => {
			res.status(status.OK).send(polls);
		})
		.catch((error) => {
			res.status(status.INTERNAL_SERVER_ERROR).send(error);
		});
});

router.get('/polls/:id', (req, res) => {
	const id = req.params.id;
	Poll.findOne({
		where: { id },
		include: [
			{
				model: Category,
				include: [
					{ model: Participant }
				]
			}
		]
	})
		.then((poll) => {
			if (poll) {
				res.status(status.OK).send(poll);
			} else {
				res.status(status.BAD_REQUEST).send({ error: 'poll does not exist' });
			}
		})
		.catch((error) => {
			// tslint:disable-next-line: no-console
			res.status(status.INTERNAL_SERVER_ERROR).send(error);
		});
});

router.get('/polls/:id/all', passport.authenticate('jwt', { session: false }), (req, res) => {
	const id = req.params.id;
	Poll.findAll({ where: { userId: id } })
		.then((polls) => {
			res.status(status.OK).send(polls);
		})
		.catch((error) => {
			res.status(status.INTERNAL_SERVER_ERROR).send(error);
		});
});

router.post('/polls', passport.authenticate('jwt', { session: false }), (req, res) => {
	const pollData = req.body;
	try {
		const { data, valid, error } = pollSchema.createPollValidator(pollData);
		if (!valid) throw error;

		User.findByPk(data.userId)
			.then((pollUser) => {
				if (!pollUser) {
					res.status(status.BAD_REQUEST).send({ error: 'user does not exist' });
				} else {
					let image: any = null;
					if (data.image) {
						image = data.image;
						delete data.image;
					}
					Poll.create(data)
						.then(async(poll) => {
							if (image) {
								const filename = `polls/${poll.id}`;
								image = upload(image, filename);
								await poll.update({ image });
								res.status(status.CREATED).send(poll);
							}
							res.status(status.CREATED).send(poll);
						})
						.catch((err) => {
							res.status(status.INTERNAL_SERVER_ERROR).send(err);
						});
				}
			})
			.catch((err) => {
				res.status(status.INTERNAL_SERVER_ERROR).send({ error: err });
			});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

router.put('/polls/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const id = req.params.id;
	const pollData = req.body;
	try {
		const { data, valid, error } = pollSchema.updatePollValidator(pollData);
		if (!valid) throw error;
		Poll.findByPk(id)
			.then((poll) => {
				const { image } = data;
				if (image) {
					const filename = `polls/${poll.id}`;
					data.image = upload(image, filename);
				}
				poll
					.update(data)
					.then((newpoll) => {
						res.status(status.OK).send(newpoll);
					})
					.catch((err) => {
						res.status(status.INTERNAL_SERVER_ERROR).send(err);
					});
			})
			.catch((err) => {
				res.status(status.INTERNAL_SERVER_ERROR).send(err);
			});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

router.delete('/polls/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const id = req.params.id;
	Poll.findByPk(id)
		.then((poll) => {
			poll
				.destroy()
				.then(() => {
					res.status(202).send();
				})
				.catch((error) => {
					res.status(status.INTERNAL_SERVER_ERROR).send(error.error);
				});
		})
		.catch((error) => {
			res.status(status.INTERNAL_SERVER_ERROR).send(error);
		});
});

router.post('/polls/:id/activate', passport.authenticate('jwt', { session: false }), (req, res) => {
	const id = req.params.id;
	Poll.findOne({
		where: { id },
		include: [
			{
				model: Category,
				include: [
					{ model: Participant }
				]
			}
		]
	})
		.then((poll) => {
			if (poll && !poll.code) {
				getNewCode()
					.then((data: any) => {
						poll
							.update({ code: data.code, live: true })
							.then((updatedPoll) => {
								const pollKey = 'poll:' + updatedPoll.code;
								const expiry =
									Math.abs(
										new Date().getTime() -
											new Date(updatedPoll.expiryDate).getTime()
									) / 1000;
								client.setex(pollKey, expiry, JSON.stringify(updatedPoll));
								res.status(status.OK).send(updatedPoll);
							})
							.catch((err) => {
								res
									.status(status.INTERNAL_SERVER_ERROR)
									.send({ error: err.errors });
							});
					})
					.catch((err) => {
						res.status(status.INTERNAL_SERVER_ERROR).send({ error: err.errors });
					});
			}
			if (poll && poll.code) {
				poll
					.update({ live: true })
					.then((updatedPoll) => {
						res.status(status.OK).send(updatedPoll);
					})
					.catch((err) => {
						res.status(status.INTERNAL_SERVER_ERROR).send({ error: err.errors });
					});
			} else {
				res.status(status.BAD_REQUEST).send({ error: 'poll does not exist' });
			}
		})
		.catch((error) => {
			res.status(status.INTERNAL_SERVER_ERROR).send({ error: error.errors });
		});
});

router.post(
	'/polls/:id/deactivate',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const id = req.params.id;
		Poll.findByPk(id)
			.then((poll) => {
				if (poll) {
					client.del('poll:' + poll.code);
					poll
						.update({ code: null, live: false })
						.then((updatedPoll) => {
							res.status(status.OK).send(updatedPoll);
						})
						.catch((error) => {
							res.status(status.INTERNAL_SERVER_ERROR).send(error.errors);
						});
				} else {
					res.status(status.BAD_REQUEST).send({ error: 'poll does not exist' });
				}
			})
			.catch((error) => {
				res.status(status.INTERNAL_SERVER_ERROR).send(error.errors);
			});
	}
);

export default router;
