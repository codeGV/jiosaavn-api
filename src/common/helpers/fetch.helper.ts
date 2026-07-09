import { userAgents, type Endpoints } from '#common/constants'
import type { ApiContextEnum } from '#common/enums'

type EndpointValue = (typeof Endpoints)[keyof typeof Endpoints]

interface FetchParams {
  endpoint: EndpointValue
  params: Record<string, string | number>
  context?: ApiContextEnum
  cookies?: Record<string, string>
}

interface FetchResponse<T> {
  data: T
  ok: Response['ok']
}

export const useFetch = async <T>({ endpoint, params, context, cookies }: FetchParams): Promise<FetchResponse<T>> => {
  const url = new URL('https://www.jiosaavn.com/api.php')

  url.searchParams.append('__call', endpoint.toString())
  url.searchParams.append('_format', 'json')
  url.searchParams.append('_marker', '0')
  url.searchParams.append('api_version', '4')
  url.searchParams.append('ctx', context || 'web6dot0')

  Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])))

  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'User-Agent': randomUserAgent }

  if (cookies && Object.keys(cookies).length > 0) {
    headers.Cookie = Object.entries(cookies)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('; ')
  }

  const response = await fetch(url.toString(), { headers })

  const data = await response.json()

  return { data: data as T, ok: response.ok }
}
