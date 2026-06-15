import { DownloadLinkModel } from '#common/models'
import { AlbumAPIResponseModel, AlbumModel } from '#modules/albums/models'
import { ArtistAlbumAPIResponseModel } from '#modules/artists/models/artist-album.model.js'
import { SongModel } from '#modules/songs/models'
import { z } from 'zod'

const ChartsSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  type: z.string(),
  image: z.array(DownloadLinkModel),
  url: z.string(),
  firstname: z.string(),
  explicitContent: z.string(),
  language: z.string()
})

const PlaylistsSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  type: z.string(),
  image: z.array(DownloadLinkModel),
  url: z.string(),
  songCount: z.string(),
  firstname: z.string(),
  followerCount: z.string(),
  lastUpdated: z.string(),
  userId: z.string(),
  explicitContent: z.string()
})

const TrendingSchema = z.object({
  songs: z.array(SongModel),
  albums: z.array(AlbumModel)
})

export const DashboardModel = z.object({
  albums: z.array(AlbumModel),
  charts: z.array(ChartsSchema),
  trending: TrendingSchema,
  playlists: z.array(PlaylistsSchema)
})

export const DashboardAPIResponseModel = z.object({
  radio: z.object({
    featured_stations: z.array(
      z.object({
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
        explicit_content: z.string(),
        mini_obj: z.boolean()
      })
    )
  }),
  browse_discover: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      type: z.string(),
      image: z.string(),
      perma_url: z.string(),
      more_info: z.object({
        badge: z.string(),
        sub_type: z.string(),
        available: z.string(),
        is_featured: z.string(),
        tags: z.any(),
        video_url: z.string(),
        video_thumbnail: z.string()
      }),
      explicit_content: z.string(),
      mini_obj: z.boolean()
    })
  ),
  new_albums: z.array(AlbumAPIResponseModel),
  charts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      type: z.string(),
      image: z.string(),
      perma_url: z.string(),
      more_info: z.object({
        firstname: z.string()
      }),
      explicit_content: z.string(),
      mini_obj: z.boolean(),
      language: z.string()
    })
  ),
  top_shows: z.object({
    badge: z.string(),
    shows: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        subtitle: z.string(),
        type: z.string(),
        image: z.string(),
        perma_url: z.string(),
        more_info: z.object({
          season_number: z.string(),
          release_date: z.string(),
          year: z.string(),
          badge: z.string(),
          square_image: z.string()
        }),
        explicit_content: z.string(),
        mini_obj: z.boolean()
      })
    ),
    last_page: z.boolean()
  }),
  new_trending: z.array(
    z.object({
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
      list_count: z.string(),
      list_type: z.string(),
      list: z.string(),
      more_info: z.object({
        release_date: z.string(),
        song_count: z.string(),
        artistMap: z.object({
          primary_artists: z.array(ArtistAlbumAPIResponseModel),
          featured_artists: z.array(ArtistAlbumAPIResponseModel),
          artists: z.array(ArtistAlbumAPIResponseModel)
        }),
        music: z.string().optional(),
        album_id: z.string(),
        album: z.string(),
        label: z.string(),
        origin: z.string().optional(),
        is_dolby_content: z.boolean().optional(),
        '320kbps': z.string().optional(),
        encrypted_media_url: z.string().optional(),
        encrypted_cache_url: z.string().optional(),
        album_url: z.string(),
        duration: z.string(),
        rights: z
          .object({
            code: z.string(),
            cacheable: z.string(),
            delete_cached_object: z.string(),
            reason: z.string()
          })
          .optional()
      })
    })
  ),
  top_playlists: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      type: z.string(),
      image: z.string(),
      perma_url: z.string(),
      more_info: z.object({
        song_count: z.string(),
        firstname: z.string(),
        follower_count: z.string(),
        last_updated: z.string(),
        uid: z.string()
      }),
      explicit_content: z.string(),
      mini_obj: z.boolean()
    })
  )
})
