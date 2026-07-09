import { createImageLinks } from '#common/helpers'
import type { RadioStationAPIResponseModel, RadioStationModel } from '#modules/radio/models'
import type { z } from 'zod'

export const createRadioStationPayload = (
  station: z.infer<typeof RadioStationAPIResponseModel>
): z.infer<typeof RadioStationModel> => ({
  id: station.id,
  name: station.title,
  subtitle: station.subtitle,
  type: station.type,
  image: createImageLinks(station.image),
  url: station.perma_url,
  description: station.more_info?.description || null,
  language: station.more_info?.language || null,
  color: station.more_info?.color || null,
  explicitContent: station.explicit_content === '1'
})
