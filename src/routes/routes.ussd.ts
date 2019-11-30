import { Router } from 'express';
import status from 'http-status';
import msg from '../util/msg.builder';
import { Poll } from '../models/poll.model';
import { Category } from '../models/category.model';
import { Participant } from '../models/participants.model';
import { ussdValidator } from '../schema/ussd.schema';
import { decodeSession } from '../util/session.decoder';
import client from '../datastores/redis';

const router = Router();

const handleRes = (sessionKey: string, session: string, reqData: any, res: any) => {
	const response = {
		USERID: 'nalotest',
		MSISDN: reqData.MSISDN,
		MSG: '',
		MSGTYPE: false
	};
	const { code, state } = decodeSession(session);
	const pollKey = 'poll:' + code;
	client.get(pollKey, (err, pollstore) => {
		if (err) {
			throw err;
		}
		if (pollstore) {
			const poll = JSON.parse(pollstore);
			response.MSG = msg(state, poll);
			client.setex(sessionKey, 120, session);
			res.status(status.OK).send(response);
		} else {
			Poll.findOne({
				where: { code },
				include: [
					{
						model: Category,
						include: [
							{ model: Participant }
						]
					}
				]
			})
				.then((poll: any) => {
					if (poll) {
						const expiry = Math.ceil(
							Math.abs(new Date().getTime() - new Date(poll.expiryDate).getTime()) /
								1000
						);
						client.setex(pollKey, expiry, JSON.stringify(poll));
						response.MSG = msg(state, poll);
						client.setex(sessionKey, 120, session);
						res.status(status.OK).send(response);
					} else {
						response.MSG = 'INVALID CODE ';
						response.MSGTYPE = true;
						client.del(sessionKey);
						res.status(status.OK).send(response);
					}
				})
				.catch((_err) => {
					response.MSG = 'APPLICATION DOWN';
					response.MSGTYPE = true;
					client.del(sessionKey);
					res.status(status.OK).send(response);
				});
		}
	});
};

router.post('/ussd', (req, res) => {
	const reqData = req.body;
	const response = {
		USERID: 'nalotest',
		MSISDN: reqData.MSISDN,
		MSG: '',
		MSGTYPE: false
	};
	const sessionKey = 'ussd:' + reqData.MSISDN;
	try {
		const { data, valid, error } = ussdValidator(reqData);
		if (!valid) {
			throw { status: status.BAD_REQUEST, error };
		}
		if (data.MSGTYPE) {
			const session = data.USERDATA.substr(1) + '*';
			handleRes(sessionKey, data, res, session);
		} else {
			client.get(sessionKey, (_error, sessionStore) => {
				if (_error) {
					throw { status: status.INTERNAL_SERVER_ERROR, _error };
				}
				if (sessionStore) {
					const session = sessionStore + data.USERDATA;
					handleRes(sessionKey, session, data, res);
				} else {
					response.MSG = 'APPLICATION DOWN';
					response.MSGTYPE = true;
					client.del(sessionKey);
					res.status(status.INTERNAL_SERVER_ERROR).send(response);
				}
			});
		}
	} catch (err) {
		// tslint:disable-next-line: no-shadowed-variable
		client.del(sessionKey);
		res.status(status.INTERNAL_SERVER_ERROR).send(err);
	}
});

export default router;
