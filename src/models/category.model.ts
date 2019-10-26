import {
	Table,
	Column,
	Model,
	HasMany,
	DeletedAt,
	BelongsTo,
	ForeignKey,
	CreatedAt,
	UpdatedAt
} from 'sequelize-typescript';
import { Poll } from './poll.model';
import { Participant } from './participants.model';

@Table({
	timestamps: true,
	paranoid: true
})
export class Category extends Model<Category> {
	@Column({
		allowNull: false
	})
	name: string;

	@CreatedAt createOn: Date;

	@UpdatedAt updatedOn: Date;

	@DeletedAt deletedOn: Date;

	@ForeignKey(() => Poll)
	@Column
	pollId: number;

	@BelongsTo(() => Poll)
	poll: Poll;

	@HasMany(() => Participant)
	participants: Participant[];
}
