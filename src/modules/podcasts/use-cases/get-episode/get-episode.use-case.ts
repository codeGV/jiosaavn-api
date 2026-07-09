import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { createEpisodePayload } from '#modules/podcasts/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '#common/types'
import type { EpisodeByTokenAPIResponseModel, EpisodeModel } from '#modules/podcasts/models'
import type { z } from 'zod'

export class GetEpisodeUseCase implements IUseCase<string, z.infer<typeof EpisodeModel>> {
  constructor() {}

  async execute(token: string) {
    const { data } = await useFetch<z.infer<typeof EpisodeByTokenAPIResponseModel>>({
      endpoint: Endpoints.podcasts.episode,
      params: { token, type: 'episode', includeMetaTags: 0 }
    })

    if (!data?.episodes?.length) throw new HTTPException(404, { message: 'episode not found' })

    return createEpisodePayload(data.episodes[0])
  }
}
