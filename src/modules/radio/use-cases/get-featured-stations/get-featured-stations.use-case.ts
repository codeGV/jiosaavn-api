import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { createRadioStationPayload } from '#modules/radio/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '#common/types'
import type { FeaturedStationsAPIResponseModel, RadioStationModel } from '#modules/radio/models'
import type { z } from 'zod'

export class GetFeaturedStationsUseCase implements IUseCase<any, z.infer<typeof RadioStationModel>[]> {
  constructor() {}

  async execute() {
    const { data } = await useFetch<z.infer<typeof FeaturedStationsAPIResponseModel>>({
      endpoint: Endpoints.radio.featuredStations,
      params: {}
    })

    if (!data) throw new HTTPException(404, { message: 'no featured stations found' })

    return Object.values(data).map(createRadioStationPayload)
  }
}
