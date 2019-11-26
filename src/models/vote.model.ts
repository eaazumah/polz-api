import {
	Table,
	Column,
	Model,
	CreatedAt,
	UpdatedAt,
	DeletedAt,
	ForeignKey,
	BelongsTo
} from 'sequelize-typescript';
import { Participant } from './participants.model';
import { Poll } from './poll.model';
import { Category } from './category.model';

@Table({
	timestamps: true,
	paranoid: true
})
export class Vote extends Model<Vote> {
	@Column({
		allowNull: true,
		defaultValue: null
	})
	phone: string;

	@Column({
		allowNull: false,
		defaultValue: 'PROGRESS'
	})
	status: string;

	@Column({
		allowNull: false
	})
	transactionId: string;

	@Column({
		allowNull: false,
		defaultValue: 1
	})
	units: number;

	@Column({
		allowNull: false,
		defaultValue: 0.0
	})
	amount: number;

	@CreatedAt createOn: Date;

	@UpdatedAt updatedOn: Date;

	@DeletedAt deletedOn: Date;

	@ForeignKey(() => Participant)
	@Column
	participantId: number;

	@ForeignKey(() => Category)
	@Column
	categoryId: number;

	@ForeignKey(() => Poll)
	@Column
	pollId: number;

	@BelongsTo(() => Participant)
	participant: Participant;

	@BelongsTo(() => Category)
	category: Category;

	@BelongsTo(() => Poll)
	poll: Poll;
}
