export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy'
export type Visibility = 'great' | 'good' | 'ok' | 'poor'

export interface IDiaryObject {
  id: number
  date: string
  weather: Weather
  visibility: Visibility
  comment: string
}

export type INewDiaryEntry = Omit<IDiaryObject, 'id'>

export type IExamplePick = Pick<IDiaryObject, 'id' | 'date'>
