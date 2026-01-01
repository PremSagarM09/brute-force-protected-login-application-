import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserIp } from './userIp.model';

@Table({ tableName: 'login_logs', timestamps: true })
export class LoginLog extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => UserIp)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ip_id!: number;

  @BelongsTo(() => UserIp)
  userIp?: UserIp;

  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 1 })
  status!: boolean;
}

export default LoginLog;