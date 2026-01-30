import { server } from '../config/server'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

afterAll(async () => {
  await server.close()
})

const uniqueId = uuidv4().substring(0, 8)
const email = `testuser_${uniqueId}@example.com`
const password = 'TestPassword123!'
let accessToken: string
let refreshToken: string

describe('Auth Tests', () => {
  test('POST /api/v1/register - Should register a new user', async () => {
    const response = await request(server.getService())
      .post('/api/v1/register')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        data: {
          type: 'user',
          attributes: {
            email,
            password
          }
        }
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data.type', 'session')
  })

  test('POST /api/v1/login - Should login and return tokens', async () => {
    const response = await request(server.getService())
      .post('/api/v1/login')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        data: {
          type: 'user',
          attributes: {
            email,
            password,
            device_id: 'device_test_1',
            device_type: 'test_runner'
          }
        }
      })

    expect(response.statusCode).toBe(200)
    // The response attributes use camelCase
    expect(response.body).toHaveProperty('data.attributes.accessToken')
    expect(response.body).toHaveProperty('data.attributes.refreshToken')

    accessToken = response.body.data.attributes.accessToken
    refreshToken = response.body.data.attributes.refreshToken
  })

  test('POST /api/v1/refresh_token - Should refresh access token', async () => {
    const response = await request(server.getService())
      .post('/api/v1/refresh_token')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        data: {
          type: 'refresh_token',
          attributes: {
            refresh_token: refreshToken
          }
        }
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data.attributes.accessToken')
    // Update accessToken if new one received
    if (response.body.data?.attributes?.accessToken) {
      accessToken = response.body.data.attributes.accessToken
    }
  })

  test('POST /api/v1/logout - Should logout successfully', async () => {
    const response = await request(server.getService())
      .post('/api/v1/logout')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        data: {
          type: 'user',
          attributes: {
            refresh_token: refreshToken
          }
        }
      })

    expect(response.statusCode).toBe(200)
  })

  // To test logout_all we probably need to login again to get valid tokens
  test('POST /api/v1/logout_all - Should logout all sessions', async () => {
    // Login again to get fresh tokens
    const loginResponse = await request(server.getService())
      .post('/api/v1/login')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        data: {
          type: 'user',
          attributes: {
            email,
            password,
            device_id: 'device_test_2',
            device_type: 'test_runner_2'
          }
        }
      })

    const newAccessToken = loginResponse.body.data.attributes.accessToken

    const response = await request(server.getService())
      .post('/api/v1/logout_all')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${newAccessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
  })
})
