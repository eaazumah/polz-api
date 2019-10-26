import express from 'express';
import uuidv4 from 'uuid/v4';
import status from 'http-status';
import * as pollController from '../controllers/controllers.polls';
import * as pollSchema from '../schema/poll.schema';
import redis from 'redis';
import menu from '../util/menu';
import { Poll } from '../models/poll.model';
import { User } from '../models/user.model';

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
	Poll.findByPk(id)
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

router.get('/polls/:id/all', (req, res) => {
	const id = req.params.id;
	Poll.findAll({ where: { userId: id } })
		.then((polls) => {
			res.status(status.OK).send(polls);
		})
		.catch((error) => {
			res.status(status.INTERNAL_SERVER_ERROR).send(error);
		});
});

router.post('/polls', (req, res) => {
	const pollData = req.body;
	// let code: string = pollData.name.match(/\b(\w)/g).join('').toUpperCase();
	// if (code.length < 4) {
	// 	code = code + ('' + Math.random()).substring(2, 2 + 4 - code.length);
	// 	pollData.code = code;
	// } else {
	// 	code = code.substring(0, 4);
	// 	pollData.code = code;
	// }
	try {
		const { data, valid, error } = pollSchema.createPollValidator(pollData);
		if (!valid) throw error;
		// const pollKey = 'poll:' + data.code;
		// const expiry = Math.abs(new Date().getTime() - new Date(data.expiryDate).getTime()) / 1000;
		User.findByPk(data.userId)
			.then((pollUser) => {
				if (!pollUser) {
					res.status(status.BAD_REQUEST).send({ error: 'user does not exist' });
				} else {
					Poll.create(data)
						.then((user) => {
							res.status(status.CREATED).send(user);
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

router.put('/polls/:id', (req, res) => {
	const id = req.params.id;
	const pollData = req.body;
	try {
		const { data, valid, error } = pollSchema.updatePollValidator(pollData);
		if (!valid) throw error;
		Poll.findByPk(id)
			.then((user) => {
				user
					.update(data)
					.then((newUser) => {
						res.status(status.OK).send(newUser);
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

router.delete('/polls/:id', (req, res) => {
	const id = req.params.id;
	Poll.findByPk(id)
		.then((user) => {
			user
				.destroy()
				.then(() => {
					res.status(202).send();
				})
				.catch((error) => {
					res.status(status.INTERNAL_SERVER_ERROR).send();
				});
		})
		.catch((error) => {
			res.status(status.INTERNAL_SERVER_ERROR).send(error);
		});
});

router.post('/polls/ussd', (req, res) => {
	const userData = req.body;
	const response = {
		USERID: 'nalotest',
		MSISDN: userData.MSISDN,
		MSG: '',
		MSGTYPE: false
	};
	let pollKey = '';
	const sessionKey = 'ussd:' + userData.MSISDN;
	let session = '0';
	try {
		if (!(userData.USERID && userData.USERDATA && userData.MSISDN)) {
			throw { status: status.BAD_REQUEST, error: new Error('missing params') };
		}
		if (userData.MSGTYPE) {
			client.setex(sessionKey, 120, session);
			response.MSG = 'Please enter program code';
			res.status(status.OK).send(response);
		} else {
			client.get(sessionKey, (error, sessionStore) => {
				if (error) {
					throw { status: status.INTERNAL_SERVER_ERROR, error };
				}
				if (sessionStore) {
					sessionStore.length === 1
						? (pollKey = 'poll:' + userData.USERDATA)
						: 'poll:' + sessionStore.slice(1, 5);
					session = sessionStore + userData.USERDATA;
					client.setex(sessionKey, 120, session);
					client.get(pollKey, (err, pollstore) => {
						if (err) {
							throw {
								status: status.INTERNAL_SERVER_ERROR,
								err
							};
						}
						if (pollstore) {
							const poll = JSON.parse(pollstore);
							response.MSG = menu(session, poll);
							res.status(status.OK).send(response);
						} else {
							pollController
								.queryByCode(pollKey.slice(5))
								.then((poll: any) => {
									const expiry =
										Math.abs(
											new Date().getTime() -
												new Date(poll.expiryDate).getTime()
										) / 1000;
									client.setex(pollKey, expiry, JSON.stringify(poll));
									response.MSG = menu(session, poll);
									res.status(status.OK).send(response);
								})
								.catch((errors) => {
									if (errors === true) {
										response.MSG =
											'program code ' + pollKey.slice(5) + 'does not exist';
										response.MSGTYPE = true;
										res.status(status.OK).send(response);
									} else {
										response.MSG = 'APPLICATION DOWN';
										response.MSGTYPE = true;
										res.status(status.BAD_REQUEST).send(response);
									}
								});
						}
					});
				} else {
					client.setex(sessionKey, 120, session);
					response.MSG = 'Please enter program code';
					res.status(status.OK).send(response);
				}
			});
		}
	} catch (error) {
		res.status(error.status).send(error.error);
	}
});

export default router;
