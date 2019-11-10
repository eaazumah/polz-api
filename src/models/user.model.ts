import {
	Table,
	Column,
	Model,
	HasMany,
	DeletedAt,
	CreatedAt,
	UpdatedAt,
	IsEmail,
	Unique,
	DefaultScope,
	Scopes
} from 'sequelize-typescript';
import { Poll } from './poll.model';

// defaultScope: {
// 	attributes: { exclude: ['password']; },
//   }
// @Scopes(() => ({
// 	full: {
// 	  include: [Manufacturer]
// 	},
// 	yellow: {
// 	  where: {primaryColor: 'yellow'}
// 	}
//   }))
@Table({
	timestamps: true,
	paranoid: true
})
export class User extends Model<User> {
	@Column({
		allowNull: false
	})
	firstName: string;

	@Column({
		allowNull: false
	})
	lastName: string;

	@Unique
	@Column({
		allowNull: false
	})
	phone: string;

	@Unique
	@IsEmail
	@Column({
		allowNull: true,
		defaultValue: null
	})
	email: string;

	@Column({
		allowNull: true,
		defaultValue: null,
		comment: 'image url'
	})
	image: string;

	@Column({
		allowNull: false,
		defaultValue: 0.0
	})
	balance: number;

	@Column({
		allowNull: false
	})
	password: string;

	@Column({
		allowNull: false,
		defaultValue: false,
		comment: 'adimn user flag'
	})
	isAdmin: boolean;

	@CreatedAt createOn: Date;

	@UpdatedAt updatedOn: Date;

	@DeletedAt deletedOn: Date;

	@HasMany(() => Poll)
	polls: Poll[];
}
