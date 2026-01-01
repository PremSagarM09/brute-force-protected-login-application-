import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { LoginLog } from '../models/loginLog.model';

@Table({ tableName: 'ip_address', timestamps: true })
export class ipAddressModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_ip_blocked!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  number_of_attempts!: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  ip_address?: string;

  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 1 })
  status!: boolean;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @HasMany(() => LoginLog)
  loginLogs?: LoginLog[];
}

export default ipAddressModel;