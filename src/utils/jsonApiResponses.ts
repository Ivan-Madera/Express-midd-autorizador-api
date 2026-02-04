import { v4 as uuidv4 } from 'uuid'
import {
  type IJsonApiData,
  type IJsonApiResponseData,
  type IJsonApiResponseError,
  type IJsonApiResponseGeneric,
  type IJsonApiResponseMessage
} from '../entities/jsonApiResponses.entities'
import { Codes } from './codeStatus'

export const JsonApiResponseData = (
  type: string,
  attributes: unknown | unknown[],
  links: string,
  relationships?: unknown
): IJsonApiResponseData => {
  const uuid = uuidv4()
  const attributesArr = Array.isArray(attributes) ? attributes : [attributes]
  const result = attributesArr.map((obj) => {
    const mappedResult: IJsonApiData = {
      type,
      id: uuid,
      attributes: obj,
      links: {
        self: links
      }
    }

    if (relationships) {
      mappedResult.relationships = relationships
    }

    return mappedResult
  })

  const data = result.length === 1 ? result[0] : result

  return {
    data
  }
}

export const JsonApiResponseMessage = (
  type: string,
  message: string,
  links: string
): IJsonApiResponseMessage => {
  const uuid = uuidv4()

  return {
    data: {
      type,
      id: uuid,
      attributes: {
        message
      },
      links: {
        self: links
      }
    }
  }
}

export const JsonApiResponseError = (
  error: unknown,
  url: string
): IJsonApiResponseError => {
  const err = error as any
  const code = err?.code || 'ERROR-000'
  const status = err?.status || 500
  const pointer = url
  const suggestions = err?.suggestions || 'Please try again later'
  const title = err?.title || 'Internal Server Error'
  const message = err?.message || 'An unknown error occurred'

  return {
    code,
    status,
    source: {
      pointer
    },
    suggestedActions: suggestions,
    title,
    detail: message
  }
}

export const JsonApiResponseGeneric = (
  status: number,
  response:
    | IJsonApiResponseData
    | IJsonApiResponseMessage
    | IJsonApiResponseError
): IJsonApiResponseGeneric => {
  return {
    status,
    response
  }
}

export const JsonApiResponseValidator = (
  pointer: string,
  detail: string
): IJsonApiResponseError => {
  return {
    code: 'ERROR-001',
    status: Codes.unprocessableContent,
    source: {
      pointer
    },
    suggestedActions: 'Check the body of the request.',
    title: 'Invalid request body.',
    detail
  }
}
