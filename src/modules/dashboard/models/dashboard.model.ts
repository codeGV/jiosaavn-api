import { DownloadLinkModel } from '#common/models'
import { z } from 'zod'

export const LaunchItemAPIResponseModel = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  secondary_subtitle: z.string().optional(),
  type: z.string(),
  image: z.string(),
  perma_url: z.string(),
  explicit_content: z.string().optional(),
  count: z.number().optional(),
  more_info: z.any().optional()
})

export const LaunchModuleMetaAPIResponseModel = z.object({
  source: z.string(),
  position: z.number(),
  title: z.string(),
  subtitle: z.string().optional()
})

export const WeeklyTopEntryAPIResponseModel = z.object({
  listid: z.string(),
  image: z.string(),
  title: z.string().optional(),
  count: z.number()
})

export const DashboardAPIResponseModel = z
  .object({
    modules: z.record(z.string(), LaunchModuleMetaAPIResponseModel),
    global_config: z
      .object({
        weekly_top_songs_listid: z.record(z.string(), WeeklyTopEntryAPIResponseModel).optional()
      })
      .optional()
  })
  .catchall(z.union([z.array(LaunchItemAPIResponseModel), z.unknown()]))

const RailItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  secondarySubtitle: z.string().nullable(),
  type: z.string(),
  image: z.array(DownloadLinkModel),
  url: z.string(),
  count: z.number().nullable(),
  explicitContent: z.boolean()
})

const RailSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  position: z.number(),
  items: z.array(RailItemSchema)
})

const WeeklyTopSchema = z.object({
  language: z.string(),
  listId: z.string(),
  title: z.string().nullable(),
  image: z.array(DownloadLinkModel),
  songCount: z.number().nullable()
})

export const DashboardModel = z.object({
  rails: z.array(RailSchema),
  weeklyTop: z.array(WeeklyTopSchema)
})
