import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { ipAddressModel } from './ipAddress.model';

@Table({ tableName: 'users', timestamps: true })
export class UsersModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(50), allowNull: true })
  first_name?: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  last_name?: string;

  @Column({ type: DataType.TEXT, allowNull: true})
  username?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  password?: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  mobile?: string;

  @Column({ type: DataType.STRING(50), allowNull: true, unique: true })
  email?: string;

  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 0 })
  block_15!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 5 })
  max_attempts?: number;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 100 })
  max_ip_attempts?: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  refresh_token?: string;

  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 1 })
  status!: boolean;
  
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updatedAt?: Date;
}

export default  UsersModel;