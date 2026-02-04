import 'express'

declare global {
  namespace Express {
    interface Request {
      user_id?: number
      session_id?: number
    }
  }
}

export {}
