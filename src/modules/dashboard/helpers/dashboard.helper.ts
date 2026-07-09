import { createImageLinks } from '#common/helpers'
import type { DashboardAPIResponseModel, DashboardModel, LaunchItemAPIResponseModel } from '#modules/dashboard/models'
import type { z } from 'zod'

export const createDashboardPayload = (
  data: z.infer<typeof DashboardAPIResponseModel>
): z.infer<typeof DashboardModel> => {
  const orderedModules = Object.entries(data.modules).sort(([, a], [, b]) => a.position - b.position)

  const rails = orderedModules.reduce<z.infer<typeof DashboardModel>['rails']>((acc, [key, meta]) => {
    const items = (data as Record<string, unknown>)[key]
    if (!Array.isArray(items)) return acc

    acc.push({
      id: key,
      title: meta.title,
      subtitle: meta.subtitle || '',
      position: meta.position,
      items: (items as z.infer<typeof LaunchItemAPIResponseModel>[]).map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle || '',
        secondarySubtitle: item.secondary_subtitle || null,
        type: item.type,
        image: createImageLinks(item.image),
        url: item.perma_url,
        count: item.count ?? null,
        explicitContent: item.explicit_content === '1'
      }))
    })

    return acc
  }, [])

  const weeklyTop = Object.entries(data.global_config?.weekly_top_songs_listid ?? {}).map(([language, entry]) => ({
    language,
    listId: entry.listid,
    title: entry.title || null,
    image: createImageLinks(entry.image),
    songCount: entry.count ?? null
  }))

  return { rails, weeklyTop }
}
