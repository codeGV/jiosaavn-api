import { DownloadLinkModel } from '#common/models'
import { ArtistMapAPIResponseModel, ArtistMapModel } from '#modules/artists/models/artist-map.model'
import { z } from 'zod'

const ArtistMapAPIResponseShape = z.object({
  primary_artists: z.array(ArtistMapAPIResponseModel),
  featured_artists: z.array(ArtistMapAPIResponseModel),
  artists: z.array(ArtistMapAPIResponseModel)
})

const ArtistMapShape = z.object({
  primary: z.array(ArtistMapModel),
  featured: z.array(ArtistMapModel),
  all: z.array(ArtistMapModel)
})

export const EpisodeAPIResponseModel = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  header_desc: z.string(),
  type: z.string(),
  perma_url: z.string(),
  image: z.string(),
  language: z.string(),
  year: z.string(),
  play_count: z.string(),
  explicit_content: z.string(),
  more_info: z.object({
    release_date: z.string(),
    duration: z.string(),
    description: z.string(),
    season_no: z.string(),
    sequence_number: z.string(),
    episode_number: z.string(),
    show_id: z.string(),
    season_id: z.string(),
    show_title: z.string(),
    season_title: z.string(),
    show_url: z.string(),
    label: z.string(),
    artistMap: ArtistMapAPIResponseShape,
    encrypted_media_url: z.string()
  })
})

export const SeasonAPIResponseModel = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  type: z.string(),
  image: z.string(),
  perma_url: z.string(),
  explicit_content: z.string(),
  more_info: z.object({
    show_id: z.string(),
    show_title: z.string(),
    numEpisodes: z.string(),
    season_number: z.string(),
    description: z.string(),
    artistMap: ArtistMapAPIResponseShape
  })
})

export const ShowDetailsAPIResponseModel = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  header_desc: z.string(),
  type: z.string(),
  perma_url: z.string(),
  image: z.string(),
  language: z.string(),
  year: z.string(),
  explicit_content: z.string(),
  more_info: z.object({
    description: z.string(),
    partner_name: z.string(),
    latest_season_id: z.string(),
    latest_season_sequence: z.string(),
    release_date: z.string(),
    followers_count: z.string(),
    label: z.string(),
    square_image: z.string(),
    season_number: z.string(),
    total_episodes: z.string(),
    is_followed: z.string(),
    fan_count: z.string(),
    artistMap: ArtistMapAPIResponseShape
  })
})

export const ShowAPIResponseModel = z.object({
  show_details: ShowDetailsAPIResponseModel,
  seasons: z.array(SeasonAPIResponseModel),
  episodes: z.array(EpisodeAPIResponseModel)
})

export const EpisodeByTokenAPIResponseModel = z.object({
  episodes: z.array(EpisodeAPIResponseModel)
})

export const EpisodeModel = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string().nullable(),
  duration: z.number().nullable(),
  episodeNumber: z.number().nullable(),
  seasonNumber: z.number().nullable(),
  releaseDate: z.string().nullable(),
  playCount: z.number().nullable(),
  language: z.string(),
  explicitContent: z.boolean(),
  url: z.string(),
  show: z.object({
    id: z.string().nullable(),
    title: z.string().nullable(),
    url: z.string().nullable()
  }),
  season: z.object({
    id: z.string().nullable(),
    title: z.string().nullable()
  }),
  artists: ArtistMapShape,
  image: z.array(DownloadLinkModel),
  downloadUrl: z.array(DownloadLinkModel)
})

export const SeasonModel = z.object({
  id: z.string(),
  name: z.string(),
  showId: z.string().nullable(),
  showTitle: z.string().nullable(),
  seasonNumber: z.number().nullable(),
  episodeCount: z.number().nullable(),
  description: z.string().nullable(),
  url: z.string(),
  image: z.array(DownloadLinkModel)
})

export const ShowModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  language: z.string(),
  year: z.string().nullable(),
  releaseDate: z.string().nullable(),
  partnerName: z.string().nullable(),
  followerCount: z.number().nullable(),
  fanCount: z.string().nullable(),
  totalEpisodes: z.number().nullable(),
  latestSeasonId: z.string().nullable(),
  explicitContent: z.boolean(),
  url: z.string(),
  image: z.array(DownloadLinkModel),
  artists: ArtistMapShape
})

export const PodcastModel = z.object({
  show: ShowModel,
  seasons: z.array(SeasonModel),
  episodes: z.array(EpisodeModel)
})
