import express from 'express';
import status from 'http-status';
import {
	createParticipantValidator,
	updateParticipantValidator
} from '../schema/participant.schema';
import { Participant } from '../models/participants.model';
import { Category } from '../models/category.model';
import { upload } from '../datastores/storage';
const router = express.Router();

router.get('/participants', (_req, res) => {
	Participant.findAll()
		.then((participants) => {
			res.status(status.OK).send(participants);
		})
		.catch((err) => {
			// tslint:disable-next-line: no-console
			console.log(err);
			res.status(status.INTERNAL_SERVER_ERROR).send({ error: err.errors });
		});
});

router.get('/participants/:id/all', (req, res) => {
	const id = req.params.id;
	Participant.findAll({ where: { categoryId: id } })
		.then((participants) => {
			res.status(status.OK).send(participants);
		})
		.catch((err) => {
			// tslint:disable-next-line: no-console
			console.log(err);
			res.status(status.INTERNAL_SERVER_ERROR).send({ error: err.errors });
		});
});

router.get('/participants/:id', (req, res) => {
	const id = req.params.id;
	Participant.findByPk(id)
		.then((participants) => {
			if (participants) {
				res.status(status.OK).send(participants);
			} else {
				res.status(status.BAD_REQUEST).send({ error: 'participant does not exist' });
			}
		})
		.catch((err) => {
			res.status(status.INTERNAL_SERVER_ERROR).send({ error: err.errors });
		});
});

router.post('/participants', (req, res) => {
	const reqData = req.body;
	try {
		const { data, valid, error } = createParticipantValidator(reqData);
		if (!valid) {
			throw error;
		}
		Category.findByPk(data.categoryId)
			.then((category) => {
				if (category) {
					let image: any = null;
					if (data.image) {
						image = data.image;
						delete data.image;
					}
					Participant.create(data)
						.then(async(participants) => {
							if (image) {
								const filename = `participants/${participants.id}`;
								image = upload(image, filename);
								await participants.update({ image });
								res.status(status.CREATED).send(participants);
							} else {
								res.status(status.CREATED).send(participants);
							}
						})
						.catch((err) => {
							// tslint:disable-next-line: no-console
							console.log(err);
							res.status(status.INTERNAL_SERVER_ERROR).send({ error: err.errors });
						});
				} else {
					res.status(status.BAD_REQUEST).send({ error: 'category does not exist' });
				}
			})
			.catch((err) => {
				res.status(status.INTERNAL_SERVER_ERROR).send({ error: err.errors });
			});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

router.put('/participants/:id', (req, res) => {
	const id = req.params.id;
	const reqData = req.body;
	try {
		const { data, valid, error } = updateParticipantValidator(reqData);
		if (!valid) {
			throw error;
		}
		Participant.findByPk(id)
			.then((participant) => {
				if (participant) {
					const { image } = data;
					if (image) {
						const filename = `participants/${participant.id}`;
						data.image = upload(image, filename);
					}
					participant
						.update(data)
						.then((newParticipant) => {
							res.status(status.OK).send(newParticipant);
						})
						.catch((err) => {
							// tslint:disable-next-line: no-console
							console.log(err);
							res.status(status.INTERNAL_SERVER_ERROR).send({ error: err.errors });
						});
				} else {
					res.status(status.BAD_REQUEST).send({ error: 'participant does not exist' });
				}
			})
			.catch((errr) => {
				// tslint:disable-next-line: no-console
				console.log(errr);
				res.status(status.INTERNAL_SERVER_ERROR).send({ error: errr.errors });
			});
	} catch (error) {
		res.status(status.BAD_REQUEST).send({ error });
	}
});

router.delete('/participants/:id', (req, res) => {
	const id = req.params.id;
	Participant.findByPk(id)
		.then((participant) => {
			participant
				.destroy()
				.then(() => {
					res.status(204).send();
				})
				.catch((error) => {
					res.status(status.INTERNAL_SERVER_ERROR).send({ error: error.errors });
				});
		})
		.catch((error) => {
			res.status(status.INTERNAL_SERVER_ERROR).send({ error: error.errors });
		});
});

export default router;
