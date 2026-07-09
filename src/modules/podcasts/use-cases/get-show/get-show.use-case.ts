import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { createPodcastPayload } from '#modules/podcasts/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '#common/types'
import type { PodcastModel, ShowAPIResponseModel } from '#modules/podcasts/models'
import type { z } from 'zod'

export interface GetShowArgs {
  token: string
  seasonNumber?: number
  sortOrder?: 'asc' | 'desc'
}

export class GetShowUseCase implements IUseCase<GetShowArgs, z.infer<typeof PodcastModel>> {
  constructor() {}

  async execute({ token, seasonNumber, sortOrder }: GetShowArgs) {
    const { data } = await useFetch<z.infer<typeof ShowAPIResponseModel>>({
      endpoint: Endpoints.podcasts.show,
      params: {
        token,
        type: 'show',
        season_number: seasonNumber || 1,
        sort_order: sortOrder || '',
        includeMetaTags: 0
      }
    })

    if (!data?.show_details) throw new HTTPException(404, { message: 'show not found' })

    return createPodcastPayload(data)
  }
}
