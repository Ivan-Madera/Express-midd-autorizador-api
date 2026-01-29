import { type INewDiaryEntry } from '../entities/diaries.entities'
import { type IJsonApiResponseGeneric } from '../entities/jsonApiResponses.entities'
import diariesData from '../json/diaries.json'
import { Codes } from '../utils/codeStatus'
import {
  JsonApiResponseData,
  JsonApiResponseError,
  JsonApiResponseGeneric
} from '../utils/jsonApiResponses'

export const getDiaries = (url: string): IJsonApiResponseGeneric => {
  let status = Codes.errorServer

  try {
    status = Codes.success
    return JsonApiResponseGeneric(
      status,
      JsonApiResponseData('diaries', diariesData, url)
    )
  } catch (error) {
    return JsonApiResponseGeneric(status, JsonApiResponseError(error, url))
  }
}

export const createDiaries = (
  url: string,
  newDiaryEntry: INewDiaryEntry
): IJsonApiResponseGeneric => {
  let status = Codes.errorServer

  try {
    const newDiary = {
      id: diariesData.length + 1,
      ...newDiaryEntry
    }

    diariesData.push(newDiary)

    status = Codes.success
    return JsonApiResponseGeneric(
      status,
      JsonApiResponseData('diaries', newDiary, url)
    )
  } catch (error) {
    return JsonApiResponseGeneric(status, JsonApiResponseError(error, url))
  }
}
