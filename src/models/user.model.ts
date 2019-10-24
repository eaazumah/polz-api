import {
	Table,
	Column,
	Model,
	HasMany,
	DeletedAt,
	CreatedAt,
	UpdatedAt,
	IsEmail,
	Unique
} from 'sequelize-typescript';
import { Poll } from './poll.model';

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
		allowNull: false,
		defaultValue: 0.0
	})
	balance: number;

	@Column({
		allowNull: false
	})
	password: string;

	@CreatedAt createOn: Date;

	@UpdatedAt updatedOn: Date;

	@DeletedAt deletedOn: Date;

	@HasMany(() => Poll)
	polls: Poll[];
}
