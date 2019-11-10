import passport from 'passport';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { Op } from 'sequelize';
import CONFIG from './config';
// tslint:disable-next-line: no-implicit-dependencies
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');
opts.secretOrKey = CONFIG.jwt_encryption;

passport.serializeUser((user: any, cb) => {
	cb(null, user.id);
});

passport.deserializeUser((id: any, cb) => {
	User.findByPk(id)
		.then((user) => {
			if (user) {
				cb(null, user);
			} else {
				cb(null, null);
			}
		})
		.catch((err) => {
			const { error } = err;
			cb(error);
		});
});

passport.use(
	new LocalStrategy((emailOrPhone: any, password: any, done: any) => {
		User.findOne({
			where: {
				[Op.or]: [
					{
						phone: emailOrPhone
					},
					{
						email: emailOrPhone
					}
				]
			}
		})
			.then((user) => {
				if (user === null) {
					return done(null, false, { message: 'Incorrect credentials.' });
				}

				const compare = bcrypt.compareSync(password, user.password);

				if (compare) {
					return done(null, user);
				}
				return done(null, false, { message: 'Incorrect credentials.' });
			})
			.catch((error) => {
				return done(error, false, { message: 'Internal server error' });
			});
	})
);

passport.use(
	new JwtStrategy(
		opts,
		(
			jwtPayload: any,
			done: {
				(arg0: any, arg1: boolean): void;
				(arg0: any, arg1: any): void;
				(arg0: any, arg1: boolean): void;
			}
		) => {
			// tslint:disable-next-line: no-console
			const { user } = jwtPayload;
			const { id } = JSON.parse(user);
			// tslint:disable-next-line: no-console
			console.log(user);
			User.findOne({ where: { id } })
				.then((userFound) => {
					if (userFound) {
						return done(null, userFound);
					} else {
						return done(null, false);
						// or you could create a new account
					}
				})
				.catch((err) => {
					return done(err, false);
				});
		}
	)
);

passport.use(
	'jwt-admin',
	new JwtStrategy(
		opts,
		(
			jwtPayload: any,
			done: {
				(arg0: any, arg1: boolean): void;
				(arg0: any, arg1: any): void;
				(arg0: any, arg1: boolean): void;
			}
		) => {
			// tslint:disable-next-line: no-console
			const { user } = jwtPayload;
			const { id } = JSON.parse(user);
			// tslint:disable-next-line: no-console
			console.log(user);
			User.findOne({ where: { id, isAdmin: true } })
				.then((userFound) => {
					if (userFound) {
						return done(null, userFound);
					} else {
						return done(null, false);
						// or you could create a new account
					}
				})
				.catch((err) => {
					return done(err, false);
				});
		}
	)
);
