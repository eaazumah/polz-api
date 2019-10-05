import express from "express";
import uuidv4 from "uuid/v4";
import bcrypt from "bcrypt";
import status from "http-status";
import * as userController from "../controllers/controllers.users";
import * as userModel from "../models/models.user";

const router = express.Router();

router.get("/users", (_req, res) => {
    userController
        .readAll()
        .then(users => {
            console.log(users);
            res.send(users);
        })
        .catch(() => {
            res.status(status.INTERNAL_SERVER_ERROR).json({
                message: "internal server error"
            });
        });
});

router.get("/users/:id", (req, res) => {
    const id = req.params.id;
    userController
        .read(id)
        .then(user => {
            console.log(user);
            res.send(user);
        })
        .catch(() => {
            res.status(status.INTERNAL_SERVER_ERROR).json({
                message: "internal server error"
            });
        });
});

router.post("/users", (req, res) => {
    const userData = req.body;
    try {
        userData.id = uuidv4();
        const { data, valid, error } = userModel.userValidator(userData);
        if (valid) {
            bcrypt.hash(userData.password, 10, async (_error, hash) => {
                if (hash) {
                    data.password = hash;
                    userController
                        .create(data)
                        .then(() => {
                            res.status(status.CREATED).send();
                        })
                        .catch(() => {
                            res.status(status.INTERNAL_SERVER_ERROR).json({
                                message: "internal server error"
                            });
                        });
                } else {
                    res.status(status.INTERNAL_SERVER_ERROR).json({
                        message: "internal server error"
                    });
                }
            });
        } else {
            throw error;
        }
    } catch (error) {
        res.status(status.BAD_REQUEST).send(error);
    }
});

export default router;
