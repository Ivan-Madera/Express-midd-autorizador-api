export const validationErrors = {
  HTTP_METHOD: {
    code: 'ERROR-002',
    suggestions: 'Check the HTTP method used in the request.',
    title: 'HTTP method not allowed.'
  },
  CONTENT_TYPE: {
    code: 'ERROR-003',
    suggestions: 'Check the Content-Type header in the request.',
    title: 'Content-Type not allowed.'
  },
  MISSING_BEARER: {
    code: 'ERROR-004',
    suggestions: 'Check the Authorization header in the request.',
    title: 'Authorization header missing.'
  },
  INVALID_TOKEN: {
    code: 'ERROR-005',
    suggestions: 'Check the token used in the request.',
    title: 'Invalid token.'
  },
  INVALID_APPKEY: {
    code: 'ERROR-006',
    suggestions: 'Check the appkey used in the request.',
    title: 'Invalid appkey.'
  }
}
