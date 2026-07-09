import { DownloadLinkModel } from '#common/models'
import { z } from 'zod'

export const RadioStationAPIResponseModel = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  type: z.string(),
  image: z.string(),
  perma_url: z.string(),
  more_info: z.object({
    description: z.string(),
    featured_station_type: z.string(),
    query: z.string(),
    color: z.string(),
    language: z.string(),
    station_display_text: z.string()
  }),
  explicit_content: z.string()
})

export const FeaturedStationsAPIResponseModel = z.record(z.string(), RadioStationAPIResponseModel)

export const CreateFeaturedStationAPIResponseModel = z.object({
  stationid: z.string()
})

export const RadioStationModel = z.object({
  id: z.string(),
  name: z.string(),
  subtitle: z.string(),
  type: z.string(),
  image: z.array(DownloadLinkModel),
  url: z.string(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  color: z.string().nullable(),
  explicitContent: z.boolean()
})
