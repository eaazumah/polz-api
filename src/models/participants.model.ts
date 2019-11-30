import {
	Table,
	Column,
	Model,
	HasMany,
	DeletedAt,
	CreatedAt,
	UpdatedAt,
	ForeignKey,
	BelongsTo
} from 'sequelize-typescript';
import { Category } from './category.model';
import { Vote } from './vote.model';

@Table({
	timestamps: true,
	paranoid: true
})
export class Participant extends Model<Participant> {
	@Column({
		allowNull: false,
		comment: 'Participant name'
	})
	name: string;

	@Column({
		allowNull: true,
		defaultValue: null,
		comment: 'Participant image url'
	})
	image: string;

	@Column({
		allowNull: false,
		defaultValue: 0
	})
	totalVotes: number;

	@CreatedAt createOn: Date;

	@UpdatedAt updatedOn: Date;

	@DeletedAt deletedOn: Date;

	@ForeignKey(() => Category)
	@Column
	categoryId: number;

	@BelongsTo(() => Category)
	category: Category;

	@HasMany(() => Vote)
	votes: Vote[];
}
