import { createDownloadLinks, createImageLinks } from '#common/helpers'
import { createArtistMapPayload } from '#modules/artists/helpers'
import type {
  EpisodeAPIResponseModel,
  EpisodeModel,
  PodcastModel,
  SeasonAPIResponseModel,
  SeasonModel,
  ShowAPIResponseModel,
  ShowDetailsAPIResponseModel,
  ShowModel
} from '#modules/podcasts/models'
import type { z } from 'zod'

export const createEpisodePayload = (
  episode: z.infer<typeof EpisodeAPIResponseModel>
): z.infer<typeof EpisodeModel> => ({
  id: episode.id,
  name: episode.title,
  type: episode.type,
  description: episode.more_info?.description || null,
  duration: episode.more_info?.duration ? Number(episode.more_info.duration) : null,
  episodeNumber: episode.more_info?.episode_number ? Number(episode.more_info.episode_number) : null,
  seasonNumber: episode.more_info?.season_no ? Number(episode.more_info.season_no) : null,
  releaseDate: episode.more_info?.release_date || null,
  playCount: episode.play_count ? Number(episode.play_count) : null,
  language: episode.language,
  explicitContent: episode.explicit_content === '1',
  url: episode.perma_url,
  show: {
    id: episode.more_info?.show_id || null,
    title: episode.more_info?.show_title || null,
    url: episode.more_info?.show_url || null
  },
  season: {
    id: episode.more_info?.season_id || null,
    title: episode.more_info?.season_title || null
  },
  artists: {
    primary: episode.more_info?.artistMap?.primary_artists?.map(createArtistMapPayload) || [],
    featured: episode.more_info?.artistMap?.featured_artists?.map(createArtistMapPayload) || [],
    all: episode.more_info?.artistMap?.artists?.map(createArtistMapPayload) || []
  },
  image: createImageLinks(episode.image),
  downloadUrl: createDownloadLinks(episode.more_info?.encrypted_media_url)
})

export const createSeasonPayload = (season: z.infer<typeof SeasonAPIResponseModel>): z.infer<typeof SeasonModel> => ({
  id: season.id,
  name: season.title,
  showId: season.more_info?.show_id || null,
  showTitle: season.more_info?.show_title || null,
  seasonNumber: season.more_info?.season_number ? Number(season.more_info.season_number) : null,
  episodeCount: season.more_info?.numEpisodes ? Number(season.more_info.numEpisodes) : null,
  description: season.more_info?.description || null,
  url: season.perma_url,
  image: createImageLinks(season.image)
})

export const createShowPayload = (show: z.infer<typeof ShowDetailsAPIResponseModel>): z.infer<typeof ShowModel> => ({
  id: show.id,
  name: show.title,
  description: show.more_info?.description || null,
  type: show.type,
  language: show.language,
  year: show.year || null,
  releaseDate: show.more_info?.release_date || null,
  partnerName: show.more_info?.partner_name || null,
  followerCount: show.more_info?.followers_count ? Number(show.more_info.followers_count) : null,
  fanCount: show.more_info?.fan_count || null,
  totalEpisodes: show.more_info?.total_episodes ? Number(show.more_info.total_episodes) : null,
  latestSeasonId: show.more_info?.latest_season_id || null,
  explicitContent: show.explicit_content === '1',
  url: show.perma_url,
  image: createImageLinks(show.image),
  artists: {
    primary: show.more_info?.artistMap?.primary_artists?.map(createArtistMapPayload) || [],
    featured: show.more_info?.artistMap?.featured_artists?.map(createArtistMapPayload) || [],
    all: show.more_info?.artistMap?.artists?.map(createArtistMapPayload) || []
  }
})

export const createPodcastPayload = (data: z.infer<typeof ShowAPIResponseModel>): z.infer<typeof PodcastModel> => ({
  show: createShowPayload(data.show_details),
  seasons: data.seasons?.map(createSeasonPayload) || [],
  episodes: data.episodes?.map(createEpisodePayload) || []
})
