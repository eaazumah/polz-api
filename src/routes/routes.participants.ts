import express from 'express';
import bcrypt from 'bcrypt';
import status from 'http-status';
import {
	createParticipantValidator,
	updateParticipantValidator
} from '../schema/participant.schema';
import { Participant } from '../models/participants.model';

const router = express.Router();

router.get('/participants', (_req, res) => {
	Participant.findAll()
		.then((participants) => {
			res.status(status.OK).send(participants);
		})
		.catch(() => {
			res.status(status.INTERNAL_SERVER_ERROR).send();
		});
});

router.get('/participants/:id', (req, res) => {
	const id = req.params.id;
	Participant.findByPk(id)
		.then((participants) => {
			res.status(status.OK).send(participants);
		})
		.catch(() => {
			res.status(status.INTERNAL_SERVER_ERROR).send();
		});
});

router.post('/participants', (req, res) => {
	const reqData = req.body;
	try {
		const { data, valid, error } = createParticipantValidator(reqData);
		if (!valid) {
			throw error;
		}
		Participant.create(data)
			.then((participants) => {
				res.status(status.CREATED).send(participants);
			})
			.catch((err) => {
				// tslint:disable-next-line: no-console
				console.log(err);
				res.status(status.INTERNAL_SERVER_ERROR).send(err);
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
				participant
					.update(data)
					.then((newParticipant) => {
						res.status(status.OK).send(newParticipant);
					})
					.catch((err) => {
						res.status(status.INTERNAL_SERVER_ERROR).send(err);
					});
			})
			.catch((errr) => {
				res.status(status.INTERNAL_SERVER_ERROR).json(errr);
			});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
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
					res.status(status.INTERNAL_SERVER_ERROR).send(error);
				});
		})
		.catch((error) => {
			res.status(status.INTERNAL_SERVER_ERROR).send(error);
		});
});

export default router;
