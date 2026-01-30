import { DataTypes, type Model, type Optional } from 'sequelize'
import { sequelize } from '../config'

interface UserAttributes {
  id: number
  email: string
  password_hash: string
}

export interface UserCreationAttributes extends Optional<
  UserAttributes,
  'id'
> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
})

export default User
