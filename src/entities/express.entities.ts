import { Request } from 'express'

export interface IRequestWithAuth extends Request {
  user_id: number
  session_id: number
}
