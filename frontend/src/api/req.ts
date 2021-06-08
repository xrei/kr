type RequestConfig = {
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  body?: unknown
}

export const request = (apiBase: string) => (config: RequestConfig) => {
  const {url, method = 'GET', body} = config

  return fetch(apiBase + url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((r) => {
      console.log(r)
      if (r.ok) {
        return r.json()
      } else {
        throw r
      }
    })
    .catch(async (err) => {
      throw await err.json()
    })
}

export const createRequest = request
