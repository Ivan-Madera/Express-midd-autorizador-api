export interface IJsonApiData {
  type: string
  id: string
  attributes: unknown
  links: {
    self: string
  }
  relationships?: unknown
}

export interface IJsonApiResponseData {
  data: IJsonApiData | IJsonApiData[]
}

export interface IJsonApiResponseMessage {
  data: {
    type: string
    id: string
    attributes: { message: string }
    links: {
      self: string
    }
  }
}

export interface IJsonApiResponseError {
  code: string
  status: number
  source: {
    pointer: string
  }
  suggestedActions: string
  title: string
  detail: string
}

export interface IJsonApiResponseGeneric {
  status: number
  response:
    | IJsonApiResponseData
    | IJsonApiResponseMessage
    | IJsonApiResponseError
}

export interface IJsonApiResponseValidator {
  status: number
  source: {
    pointer: string
  }
  suggestedActions: string
  title: string
  detail: string
}
