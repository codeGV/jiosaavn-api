import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '#common/types'
import type { CreateFeaturedStationAPIResponseModel } from '#modules/radio/models'
import type { z } from 'zod'

export interface CreateFeaturedStationArgs {
  name?: string
  query?: string
  language?: string
  artistId?: string
  pid?: string
}

export class CreateFeaturedStationUseCase implements IUseCase<CreateFeaturedStationArgs, string> {
  constructor() {}

  async execute({ name, query, language, artistId, pid }: CreateFeaturedStationArgs) {
    const { data, ok } = await useFetch<z.infer<typeof CreateFeaturedStationAPIResponseModel>>({
      endpoint: Endpoints.radio.createFeaturedStation,
      params: {
        name: name || '',
        query: query || '',
        language: language || '',
        artistid: artistId || '',
        pid: pid || '',
        mode: ''
      }
    })

    if (!data || !ok || !data.stationid) throw new HTTPException(500, { message: 'could not create radio station' })

    return data.stationid
  }
}
