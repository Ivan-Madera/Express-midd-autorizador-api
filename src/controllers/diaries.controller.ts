import { type Handler } from 'express'
import { createDiaries, getDiaries } from '../services/diaries.service'
import { Codes } from '../utils/codeStatus'
import { JsonApiResponseError } from '../utils/jsonApiResponses'

export const diaries: Handler = (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const responseService = getDiaries(url)

    status = responseService.status
    return res.status(status).json(responseService.response)
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const diariesCreate: Handler = (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const {
      body: {
        data: { attributes }
      }
    } = req

    const responseService = createDiaries(url, attributes)

    status = responseService.status
    return res.status(status).json(responseService.response)
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}
