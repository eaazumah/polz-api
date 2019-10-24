import {
	Table,
	Column,
	Model,
	HasMany,
	DeletedAt,
	ForeignKey,
	BelongsTo,
	CreatedAt,
	UpdatedAt,
	DataType,
	IsDate
} from 'sequelize-typescript';
import { User } from './user.model';
import { Category } from './category.model';

@Table({
	timestamps: true,
	paranoid: true
})
export class Poll extends Model<Poll> {
	@Column({
		allowNull: true,
		unique: true,
		defaultValue: null,
		comment: 'Unique human readable code for the poll'
	})
	code: string;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
		defaultValue: null,
		comment: 'Json stringfied menu object of poll'
	})
	menu: string;

	@Column({
		allowNull: false,
		comment: 'Name of poll'
	})
	name: string;

	@Column({
		allowNull: true,
		defaultValue: null,
		comment: 'Poll description'
	})
	about: string;

	@Column({
		allowNull: false,
		defaultValue: 0,
		comment: 'cost per single vote'
	})
	unitCost: number;

	@Column({
		allowNull: false,
		defaultValue: false,
		comment: 'free or paid poll'
	})
	freePoll: boolean;

	@Column({
		allowNull: false,
		defaultValue: false,
		comment: 'Show weather poll has ended or not'
	})
	expired: boolean;

	@Column({
		allowNull: false,
		defaultValue: false,
		comment: 'Show weather poll has started runing'
	})
	live: boolean;

	@IsDate
	@Column({
		allowNull: false,
		comment: 'Ending date of poll'
	})
	expiryDate: Date;

	@CreatedAt createOn: Date;

	@UpdatedAt updatedOn: Date;

	@DeletedAt deletedOn: Date;

	@ForeignKey(() => User)
	@Column
	userId: number;

	@BelongsTo(() => User)
	user: User;

	@HasMany(() => Category)
	categories: Category[];
}
