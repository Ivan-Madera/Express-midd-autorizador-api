import { DataTypes, type Model, type Optional } from 'sequelize'
import { sequelize } from '../config'
import User from './User.model'

interface SessionAttributes {
  id: number
  user_id: number
  refresh_token_hash: string
  device_id: string
  device_type: string
  ip: string | null
  user_agent: string | null
  expires_at: Date
  revoked_at: Date
}

export interface SessionCreationAttributes extends Optional<
  SessionAttributes,
  'id' | 'expires_at' | 'revoked_at'
> {}

export interface SessionInstance
  extends
    Model<SessionAttributes, SessionCreationAttributes>,
    SessionAttributes {}

const Session = sequelize.define<SessionInstance>(
  'sessions',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    refresh_token_hash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    device_type: {
      type: DataTypes.STRING
    },
    ip: {
      type: DataTypes.STRING
    },
    user_agent: {
      type: DataTypes.STRING
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revoked_at: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: 'sessions',
    timestamps: false
  }
)

User.hasMany(Session, { foreignKey: 'user_id' })
Session.belongsTo(User, { foreignKey: 'user_id' })

export default Session
