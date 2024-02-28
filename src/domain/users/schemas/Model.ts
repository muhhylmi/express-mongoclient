import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: User.USER_TABLE_NAME,
})
export class User extends Model {
  public static USER_TABLE_NAME = 'user' as string;
  public static USER_ID = 'id' as string;
  public static USERNAME = 'username' as string;
  public static PASSWORD = 'password' as string;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: User.USER_ID,
  })
    id!: number;

  @Column({
    type: DataType.STRING(100),
    field: User.USERNAME,
  })
    username!: string;

  @Column({
    type: DataType.STRING(255),
    field: User.PASSWORD,
  })
    password!: string;
}