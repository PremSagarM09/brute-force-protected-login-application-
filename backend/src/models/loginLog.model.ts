import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ipAddressModel } from './ipAddress.model';
import UsersModel from './user.model';

@Table({ tableName: 'login_logs', timestamps: true })
export class LoginLog extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => ipAddressModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ip_id!: number;

  @ForeignKey(() => UsersModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 0})
  is_successful?: boolean
  
  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 1 })
  status!: boolean;
  
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt?: Date;
  
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @BelongsTo(() => ipAddressModel)
  ipAddress?: ipAddressModel;

  @BelongsTo(() => UsersModel)
  user?: UsersModel;

}

export default LoginLog;