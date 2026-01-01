import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import UsersModel from './user.model';
import { LoginLog } from '../models/loginLog.model';

@Table({ tableName: 'user_ips', timestamps: true })
export class UserIp extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => UsersModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @BelongsTo(() => UsersModel)
  user?: UsersModel;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_ip_blocked!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  number_of_attempts!: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  ip_address?: string;

  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 1 })
  status!: boolean;

  @HasMany(() => LoginLog)
  loginLogs?: LoginLog[];
}

export default UserIp;