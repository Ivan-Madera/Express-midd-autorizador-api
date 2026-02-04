import axios from 'axios'

interface IHttpResponse {
  status: number
  data: unknown
}

export const getHttp = async (
  url: string,
  options?: Record<string, unknown>
): Promise<IHttpResponse> => {
  const response = await axios.get(url, options).catch((error: unknown) => {
    const err = error as any
    if (!err.response) {
      throw new Error(
        'Error de proveedor, favor de contactar con el administrador'
      )
    }

    return {
      status: err.response.status,
      data: err.response.data
    }
  })

  return {
    status: response.status,
    data: response.data
  }
}

export const postHttp = async (
  url: string,
  body?: Record<string, unknown>,
  options?: Record<string, unknown>
): Promise<IHttpResponse> => {
  const response = await axios
    .post(url, body, options)
    .catch((error: unknown) => {
      const err = error as any
      if (!err.response) {
        throw new Error(
          'Error de proveedor, favor de contactar con el administrador'
        )
      }

      return {
        status: err.response.status,
        data: err.response.data
      }
    })

  return {
    status: response.status,
    data: response.data
  }
}

export const putHttp = async (
  url: string,
  body?: Record<string, unknown>,
  options?: Record<string, unknown>
): Promise<IHttpResponse> => {
  const response = await axios
    .put(url, body, options)
    .catch((error: unknown) => {
      const err = error as any
      if (!err.response) {
        throw new Error(
          'Error de proveedor, favor de contactar con el administrador'
        )
      }

      return {
        status: err.response.status,
        data: err.response.data
      }
    })

  return {
    status: response.status,
    data: response.data
  }
}
