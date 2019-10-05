import express from "express";
import uuidv4 from "uuid/v4";
import bcrypt from "bcrypt";
import status from "http-status";
import * as pollController from "../controllers/controllers.polls";
import * as pollModel from "../models/models.poll";
import * as metaController from "../controllers/controllers.meta";
import redis from "redis";

const client = redis.createClient();

const router = express.Router();

router.get("/polls", (_req, res) => {
	pollController
		.readAll()
		.then((polls) => {
			console.log(polls);
			res.send(polls);
		})
		.catch(() => {
			res.status(status.INTERNAL_SERVER_ERROR).json({
				message: "internal server error"
			});
		});
});

router.get("/polls/:id", (req, res) => {
	const id = req.params.id;
	pollController
		.read(id)
		.then((user) => {
			console.log(user);
			res.send(user);
		})
		.catch(() => {
			res.status(status.INTERNAL_SERVER_ERROR).json({
				message: "internal server error"
			});
		});
});

router.post("/polls", (req, res) => {
	const pollData = req.body;
	pollData.id = uuidv4();
	let code: string = pollData.name.match(/\b(\w)/g).toUpperCase();
	if (code.length > 3) {
		code = (code + Math.random()).substring(2, 2 + 4 - code.length);
		pollData.code = code;
	} else {
		code = code.substring(0, 4);
		pollData.code = code;
	}
	try {
		const { data, valid, error } = pollModel.pollValidator(pollData);
		if (valid) {
			// const expiry = Math.abs(new Date() - compareDate);
			client.setex(data, 3600, JSON.stringify(data));
			pollController.create(data).then(() => {}).catch(() => {
				res.status(status.INTERNAL_SERVER_ERROR).json({
					message: "internal server error"
				});
			});
		} else {
			throw error;
		}
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

router.post("/test", (req, res) => {
	const userData = req.body;

	const data = {
		code: 1,
		id: "sdfnkjdb",
		name: "Miss Ghana",
		about: "miss Ghana beauty pagent",
		categories: [
			{
				title: "cat1",
				participants: [
					{ name: "Azumah" },
					{ name: "Ebenezer" },
					{ name: "Adelwin" }
				]
			},
			{
				title: "cat2",
				participants: [
					{ name: "Azumah" },
					{ name: "Ebenezer" },
					{ name: "Adelwin" }
				]
			}
		]
	};

	const response = {
		USERID: "nalotest",
		MSISDN: userData.MSISDN,
		MSG: "",
		MSGTYPE: false
	};
	const pollKey = "poll:" + data.code;
	const sessionKey = "ussd:" + userData.MSISDN;
	let session = "0";
	try {
		if (!(userData.USERID && userData.USERDATA && userData.MSISDN)) {
			console.log(userData);
			throw new Error("missing params");
		}
		if (userData.MSGTYPE) {
			client.setex(sessionKey, 120, session);
			response.MSG = "Please enter program code";
			res.status(status.OK).send(response);
		} else {
			client.get(sessionKey, (err, sessionStore) => {
				if (sessionKey) {
					session = sessionStore + userData.USERDATA;
					client.setex(sessionKey, 120, session);
					client.get(pollKey, (err, pollstore) => {
						if (pollstore) {
							const sessionArray = session.split("").map(Number);
							const poll = JSON.parse(pollstore);
							if (sessionArray.length === 2) {
								response.MSG = "Please select category to vote";
								poll.categories.map((item: { name: string }, index: number) => {
									response.MSG = response.MSG + "\n" + index + ")" + item.name;
								});
								res.status(status.OK).send(response);
							} else if (sessionArray.length === 3) {
								response.MSG =
									"Please select your participant for" +
									poll.categories[sessionArray[2]].title;
								poll.categories[
									sessionArray[2]
								].participants.map((item: { name: string }, index: number) => {
									response.MSG = response.MSG + "\n" + index + ")" + item.name;
								});
								res.status(status.OK).send(response);
							}
						} else {
							client.setex(pollKey, 3600, JSON.stringify(data));
							res.send();
						}
					});
				}
			});
		}
	} catch (error) {
		res.status(status.BAD_REQUEST).send(error);
	}
});

export default router;
