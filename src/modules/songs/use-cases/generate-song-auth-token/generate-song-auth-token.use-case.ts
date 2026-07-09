import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '#common/types'

export interface GenerateSongAuthTokenArgs {
  url: string
  bitrate?: string
}

interface GenerateSongAuthTokenAPIResponse {
  auth_url: string
  status: string
}

export class GenerateSongAuthTokenUseCase implements IUseCase<GenerateSongAuthTokenArgs, string> {
  constructor() {}

  async execute({ url, bitrate }: GenerateSongAuthTokenArgs) {
    const { data } = await useFetch<GenerateSongAuthTokenAPIResponse>({
      endpoint: Endpoints.songs.generateAuthToken,
      params: { url, bitrate: bitrate || '128' }
    })

    if (data?.status !== 'success' || !data.auth_url) {
      throw new HTTPException(404, { message: 'unable to generate auth url' })
    }

    return data.auth_url
  }
}
