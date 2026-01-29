import axios from 'axios'

interface IHttpResponse {
  status: number
  data: any
}

export const getHttp = async (
  url: string,
  options: any
): Promise<IHttpResponse> => {
  const response = await axios.get(url, options).catch((error: any) => {
    if (!error.response) {
      throw new Error(
        'Error de proveedor, favor de contactar con el administrador'
      )
    }

    return {
      status: error.response.status,
      data: error.response.data
    }
  })

  return {
    status: response.status,
    data: response.data
  }
}

export const postHttp = async (
  url: string,
  body: any,
  options: any
): Promise<IHttpResponse> => {
  const response = await axios.post(url, body, options).catch((error: any) => {
    if (!error.response) {
      throw new Error(
        'Error de proveedor, favor de contactar con el administrador'
      )
    }

    return {
      status: error.response.status,
      data: error.response.data
    }
  })

  return {
    status: response.status,
    data: response.data
  }
}

export const putHttp = async (
  url: string,
  body: any,
  options: any
): Promise<IHttpResponse> => {
  const response = await axios.put(url, body, options).catch((error: any) => {
    if (!error.response) {
      throw new Error(
        'Error de proveedor, favor de contactar con el administrador'
      )
    }

    return {
      status: error.response.status,
      data: error.response.data
    }
  })

  return {
    status: response.status,
    data: response.data
  }
}
