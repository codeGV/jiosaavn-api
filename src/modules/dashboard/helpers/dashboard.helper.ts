import { createImageLinks } from '#common/helpers'
import { createAlbumPayload } from '#modules/albums/helpers'
import { createSongPayload } from '#modules/songs/helpers'
import type { DashboardAPIResponseModel, DashboardModel } from '#modules/dashboard/models'
import type { z } from 'zod'

export const createDashboardPayload = (
  modules: z.infer<typeof DashboardAPIResponseModel>
): z.infer<typeof DashboardModel> => ({
  albums: modules?.new_albums?.map((album) => createAlbumPayload(album)),
  playlists: modules?.top_playlists?.map((playlist) => {
    return {
      id: playlist?.id,
      userId: playlist?.more_info?.uid,
      title: playlist?.title,
      subtitle: playlist?.subtitle,
      type: playlist?.type,
      image: createImageLinks(playlist?.image),
      url: playlist?.perma_url,
      songCount: playlist?.more_info?.song_count,
      firstname: playlist?.more_info?.firstname,
      followerCount: playlist?.more_info?.follower_count,
      lastUpdated: playlist?.more_info?.last_updated,
      explicitContent: playlist?.explicit_content
    }
  }),
  charts: modules?.charts?.map((chart) => {
    return {
      id: chart?.id,
      title: chart?.title,
      subtitle: chart?.subtitle,
      type: chart?.type,
      image: createImageLinks(chart?.image),
      url: chart?.perma_url,
      firstname: chart?.more_info?.firstname,
      explicitContent: chart?.explicit_content,
      language: chart?.language
    }
  }),
  trending: {
    // songs: createSongPayload(modules?.new_trending.filter((trending) => trending?.type === 'song') as any)
    songs: modules?.new_trending
      .filter((trending) => trending?.type === 'song')
      .map((song) => createSongPayload(song as any)),
    albums: modules?.new_trending
      .filter((trending) => trending?.type === 'album')
      .map((album) => createAlbumPayload(album as any))
  }
})
