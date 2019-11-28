import express from 'express';
import status from 'http-status';
import * as voteSchema from '../schema/vote.schema';
import Redde from 'redde-nodejs-sdk';
import { Base64 } from 'js-base64';
import uuid from 'uuid/v4';
import { Vote } from '../models/vote.model';
const router = express.Router();
const request = require('request');
const axios = require('axios').default;

import CONFIG from '../config/config';
import { Poll } from '../models';

router.post('/vote/redde', async(req, res) => {
	const voteData = req.body;
	try {
		const { data, valid, error } = voteSchema.createVoteValidator(voteData);
		if (!valid) throw error;
		const {
			amount,
			paymentOption,
			walletNumber,
			voucherCode,
			pollId,
			categoryId,
			participantId,
			units
		} = data;

		const poll = await Poll.findByPk(pollId);

		axios({
			method: 'post',
			url: 'https://api.reddeonline.com/v1/receive',
			headers: {
				apikey: CONFIG.REDDE_API_KEY
			},
			data: {
				amount,
				appid: CONFIG.REDDE_APP_ID,
				clientreference: uuid(),
				clienttransid: uuid(),
				description: 'string',
				nickname: 'string',
				paymentoption: paymentOption,
				vouchercode: voucherCode,
				walletnumber: walletNumber
			}
		})
			.then((result: any) => {
				// tslint:disable-next-line: no-shadowed-variable
				const { data } = result;
				const {
					// tslint:disable-next-line: no-shadowed-variable
					status,
					transactionid,
					clienttransid,
					clientreference,
					statusdate,
					brandtransid
				} = data;
				if (status === 'OK') {
					Vote.create({
						status,
						units,
						phone: walletNumber,
						amount,
						pollId,
						categoryId,
						participantId,
						transactionId: transactionid
					})
						.then((vote) => {
							res.send(vote);
						})
						.catch((err) => {
							res.status(500).send(err.error);
						});
				} else if (status === 'FAILED') {
					res.status(500).send(data);
				}
			})
			// tslint:disable-next-line: no-shadowed-variable
			.catch((error: any) => {
				// tslint:disable-next-line: no-console
				console.log(error);
				res.status(status.INTERNAL_SERVER_ERROR).send(error);
			});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

router.post('/payment/redde/callback', async(req, res) => {
	const reqBody = req.body;
	try {
		const { data, valid, error } = voteSchema.reddeCallbackValidator(reqBody);
		if (!valid) throw error;
		const {
			// tslint:disable-next-line: no-shadowed-variable
			status,
			transactionid,
			clienttransid,
			clientreference,
			statusdate,
			brandtransid
		} = data;
		const vote = await Vote.findOne({
			where: {
				transactionId: transactionid
			}
		});
		if (!vote) throw Error('Transaction not found');

		// tslint:disable-next-line: no-console
		console.log(data);
		// tslint:disable-next-line: no-console
		console.log(vote);

		vote
			.update({ status })
			.then((result) => {
				// tslint:disable-next-line: no-console
				console.log(result);
				if (status === 'PAID') {
					/*
				     send sms to voter about successful vote
				    */
				} else if (status === 'PENDING' || status === 'PROGRESS') {
					/*
				     do nothing
				    */
					res.end();
				} else if (status === 'FAILED') {
					/*
				     send sms to voter about failed vote
				    */
				} else {
					res.end();
				}
			})
			.catch((err) => {
				res.end();
			});
	} catch (error) {
		res.end();
	}
});

router.post('/vote/payswitch', (req, res) => {
	const voteData = req.body;
	try {
		const { data, valid, error } = voteSchema.createVoteValidator(voteData);
		if (!valid) throw error;
		const {
			amount,
			paymentOption,
			walletNumber,
			voucherCode,
			pollId,
			categoryId,
			participantId,
			email,
			units,
			phone,
			description
		} = data;

		axios({
			method: 'post',
			url: 'https://test.theteller.net/v1.1/transaction/process',
			headers: {
				// 'content-type': 'application/json',
				// tslint:disable-next-line: object-literal-key-quotes
				Authorization:
					'Basic ' +
					Base64.encode(
						'postfortics5d64feadc31fe:YTMxYWYyZTcxZTA2MDE5MDM1ZjE0MWUxODVhMGI2OTM'
					)
			},
			data: {
				amount,
				// tslint:disable-next-line: object-literal-key-quotes
				merchant_id: 'TTM-00000762',
				// tslint:disable-next-line: object-literal-key-quotes
				transaction_id: uuid(),
				// tslint:disable-next-line: object-literal-key-quotes
				processing_code: '000200',
				// tslint:disable-next-line: object-literal-key-quotes
				desc: description,
				// tslint:disable-next-line: object-literal-key-quotes
				nickname: 'polz',
				'r-switch': paymentOption,
				// tslint:disable-next-line: object-literal-key-quotes
				voucher_code: voucherCode,
				// tslint:disable-next-line: object-literal-key-quotes
				subscriber_number: walletNumber
			}
		})
			.then((result: any) => {
				res.status(status.OK).send(result);
			})
			.catch((err: any) => {
				// tslint:disable-next-line: no-console
				console.log(err);
				res.status(status.INTERNAL_SERVER_ERROR).send(err);
			});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

export default router;
