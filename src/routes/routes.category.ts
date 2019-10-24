import express from 'express';
import bcrypt from 'bcrypt';
import status from 'http-status';
import { Category } from '../models/category.model';
import { createCategoryValidator, updateCategoryValidator } from '../schema/category.schema';

const router = express.Router();

router.get('/categories', (req, res) => {
	Category.findAll()
		.then((categories) => {
			res.status(status.OK).send(categories);
		})
		.catch(() => {
			res.status(status.INTERNAL_SERVER_ERROR).send();
		});
});

router.get('/categories/:id/all', (req, res) => {
	const userId = req.params.id;
	Category.findAll({ where: { userId } })
		.then((categories) => {
			res.status(status.OK).send(categories);
		})
		.catch(() => {
			res.status(status.INTERNAL_SERVER_ERROR).send();
		});
});

router.get('/categories/:id', (req, res) => {
	const id = req.params.id;
	Category.findByPk(id)
		.then((categories) => {
			res.status(status.OK).send(categories);
		})
		.catch(() => {
			res.status(status.INTERNAL_SERVER_ERROR).send();
		});
});

router.post('/categories', (req, res) => {
	const reqData = req.body;
	try {
		const { data, valid, error } = createCategoryValidator(reqData);
		if (!valid) {
			throw error;
		}
		Category.create(data)
			.then((categories) => {
				res.status(status.CREATED).send(categories);
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

router.put('/categories/:id', (req, res) => {
	const id = req.params.id;
	const reqData = req.body;
	try {
		const { data, valid, error } = updateCategoryValidator(reqData);
		if (!valid) {
			throw error;
		}
		Category.findByPk(id)
			.then((category) => {
				category
					.update(data)
					.then((newCategory) => {
						res.status(status.OK).send(newCategory);
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

router.delete('/categories/:id', (req, res) => {
	const id = req.params.id;
	Category.findByPk(id)
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
