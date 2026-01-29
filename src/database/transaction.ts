import { type Transaction } from 'sequelize'
import { sequelize } from './config'

export const manageTransaction = async (): Promise<Transaction> => {
  return await sequelize.transaction()
}

export const commitTransaction = async (
  transaction: Transaction
): Promise<void> => {
  if (transaction) {
    await transaction.commit()
  }
}

export const rollbackTransaction = async (
  transaction: Transaction,
  servicio: string
): Promise<void> => {
  if (transaction) {
    try {
      await transaction.rollback()
    } catch (error: any) {
      console.log(`Error en ${servicio} al hacer rollback:`, error.message)
    }
  }
}
