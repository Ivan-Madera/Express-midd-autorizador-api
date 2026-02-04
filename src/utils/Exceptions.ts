interface IErrorDefinition {
  code: string
  suggestions: string
  title: string
}

export class ErrorException extends Error {
  code: string
  status: number
  suggestions: string
  title: string
  message: string

  constructor(error: IErrorDefinition, status: number, message: string) {
    super(message)

    this.code = error.code
    this.status = status
    this.suggestions = error.suggestions
    this.title = error.title
    this.message = message
  }
}
