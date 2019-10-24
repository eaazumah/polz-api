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
		defaultValue: 'pendding'
	})
	status: string;

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

	@Column({
		allowNull: false
	})
	paymentAccountType: string;

	@Column({
		allowNull: false
	})
	paymentAccountId: string;

	@Column({
		allowNull: false,
		defaultValue: ''
	})
	voucher: string;

	@Column expiryDate: Date;

	@CreatedAt createOn: Date;

	@UpdatedAt updatedOn: Date;

	@DeletedAt deletedOn: Date;

	@ForeignKey(() => Participant)
	@Column
	participantId: number;

	@BelongsTo(() => Participant)
	participant: Participant;
}
