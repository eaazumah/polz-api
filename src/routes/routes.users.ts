import express from 'express';
import bcrypt from 'bcrypt';
import status from 'http-status';
import * as userSchema from '../schema/user.schema';
import { User } from '../models/user.model';
import passport from 'passport';
import { upload } from '../datastores/storage';
import UUID from 'uuid/v4';

const router = express.Router();

router.get('/users', (_req, res) => {
	User.findAll()
		.then((users) => {
			res.status(status.OK).send(users);
		})
		.catch((err) => {
			res.status(status.INTERNAL_SERVER_ERROR).send(err.errors);
		});
});

router.get('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const id = req.params.id;
	User.findByPk(id)
		.then((user) => {
			if (user) {
				res.status(status.OK).send(user);
			} else {
				res.status(status.BAD_REQUEST).send({ error: 'user does not exist' });
			}
		})
		.catch((err) => {
			res.status(status.INTERNAL_SERVER_ERROR).send(err.errors);
		});
});

router.post('/users', (req, res) => {
	const userData = req.body;
	try {
		const { data, valid, error } = userSchema.createUserValidator(userData);
		if (!valid) {
			throw error;
		}
		if (data.image) {
			const filename = `users/${UUID()}`;
			data.image = upload(data.image, filename);
		}
		bcrypt.hash(userData.password, 10, (_error, hash) => {
			if (hash) {
				data.password = hash;
				let image: any = null;
				if (data.image) {
					image = data.image;
					delete data.image;
				}
				User.create(data)
					.then(async (user) => {
						if (image) {
							const filename = `profile/${user.id}`;
							image = upload(image, filename);
							await user.update({ image });
							res.status(status.CREATED).send(user);
						}
						res.status(status.CREATED).send(user);
					})
					.catch((err) => {
						// tslint:disable-next-line: no-console
						console.log(err);
						res.status(status.INTERNAL_SERVER_ERROR).send(err.errors);
					});
			} else {
				// tslint:disable-next-line: no-console
				console.log(_error);

				res.status(status.INTERNAL_SERVER_ERROR).send(_error);
			}
		});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

router.post('/users/admin', (req, res) => {
	const userData = req.body;
	try {
		const { data, valid, error } = userSchema.createUserValidator(userData);
		if (!valid) {
			throw error;
		}
		bcrypt.hash(userData.password, 10, (_error, hash) => {
			if (hash) {
				data.password = hash;
				data.isAdmin = true;
				let image: any = null;
				if (data.image) {
					image = data.image;
					delete data.image;
				}
				User.create(data)
					.then(async (user) => {
						if (image) {
							const filename = `profile/${user.id}`;
							image = upload(image, filename);
							await user.update({ image });
							res.status(status.CREATED).send(user);
						}
						res.status(status.CREATED).send(user);
					})
					.catch((err) => {
						// tslint:disable-next-line: no-console
						console.log(err);
						res.status(status.INTERNAL_SERVER_ERROR).send(err.errors);
					});
			} else {
				// tslint:disable-next-line: no-console
				console.log(_error);

				res.status(status.INTERNAL_SERVER_ERROR).send(_error);
			}
		});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

router.put('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const id = req.params.id;
	const reqData = req.body;
	try {
		const { data, valid, error } = userSchema.updateUserValidator(reqData);
		if (!valid) {
			throw error;
		}
		User.findByPk(id)
			.then((user) => {
				if (user) {
					const { image } = data;
					if (image) {
						const filename = `profile/${user.id}`;
						data.image = upload(image, filename);
					}
					user
						.update(data)
						.then((newUser) => {
							res.status(status.OK).send(newUser);
						})
						.catch((err) => {
							res.status(status.INTERNAL_SERVER_ERROR).send(err.errors);
						});
				} else {
					res.status(status.BAD_REQUEST).send({ error: 'user does not exist' });
				}
			})
			.catch((errr) => {
				res.status(status.INTERNAL_SERVER_ERROR).json(errr.errors);
			});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

export default router;
