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

router.post('/vote/redde', (req, res) => {
	const voteData = req.body;
	try {
		const { data, valid, error } = voteSchema.createVoteValidator(voteData);
		if (!valid) throw error;
		const appiId = ''; // Enter Your App ID Here
		const apiKey = ''; // Enter Your Api Key Here
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
			phone
		} = data;

		const redde = new Redde(appiId, apiKey);

		// Generating Random Client Reference
		const ref = redde.clientRef(6);

		// Generating Random Client ID
		const clientid = redde.clientID(6);

		// Calling Receive Function
		const options = redde.receiveMoney(amount, paymentOption, walletNumber, ref, clientid);

		options.json.vouchercode = voucherCode;
		// Sending a request to redde endpoint
		request.post(options, (_err: any, _res: any, _body: any) => {
			if (_err) {
				res.status(status.INTERNAL_SERVER_ERROR).send(_err);

				// tslint:disable-next-line: no-console
				console.log(_err);
			}
			// tslint:disable-next-line: no-console
			console.log(JSON.parse(JSON.stringify(_body)));
		});
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

router.post('/payment/redde', function(req, res) {
	const data = req.body;
	res.send(data);
});

router.post('/vote/payswitch', (req, res) => {
	const voteData = req.body;
	try {
		const { data, valid, error } = voteSchema.createVoteValidator(voteData);
		if (!valid) throw error;
		const appiId = ''; // Enter Your App ID Here
		const apiKey = ''; // Enter Your Api Key Here
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

// Sending a request to redde endpoint
// request.post(options, (_err: any, _res: any, _body: any) => {
// 	if (_err) {
// 		res.status(status.INTERNAL_SERVER_ERROR).send(_err);
// 	}
// 	// tslint:disable-next-line: no-console
// 	console.log(JSON.parse(JSON.stringify(_body)));
// });

// const options = {
// 	url: 'https://test.theteller.net/v1.1/transaction/process',
// 	headers: {
// 		'Content-Type': 'application/json',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		Authorization:
// 			'Basic ' +
// 			Base64.encode(
// 				'postfortics5d64feadc31fe:YTMxYWYyZTcxZTA2MDE5MDM1ZjE0MWUxODVhMGI2OTM'
// 			)
// 	},
// 	json: {
// 		amount,
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		merchant_id: 'TTM-00000762',
// 		'transaction_id	': '',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		processing_code: '000200',
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		desc: description,
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		nickname: 'polz',
// 		'r-switch': paymentOption,
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		voucher_code: voucherCode,
// 		// tslint:disable-next-line: object-literal-key-quotes
// 		subscriber_number: walletNumber
// 	}
// };
