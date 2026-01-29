import { server } from '../config/server'
import { Codes } from '../utils/codeStatus'
import request from 'supertest'

afterAll(async () => {
  await server.close()
})

describe('Tests about diaries', () => {
  test('Get diaries', async () => {
    const response = await request(server.getService())
      .get('/api/diaries')
      .send()

    expect(response.statusCode).toEqual(Codes.success)
  })
})
