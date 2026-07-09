import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { SongModel } from '#modules/songs/models'
import { SongService } from '#modules/songs/services'
import { z } from 'zod'
import type { Routes } from '#common/types'
import type { hc } from 'hono/client'

export class SongController implements Routes {
  public controller: OpenAPIHono
  public static songClient: typeof hc
  private songService: SongService

  constructor() {
    this.controller = new OpenAPIHono()
    this.songService = new SongService()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/songs',
        tags: ['Songs'],
        summary: 'Retrieve songs by ID or link',
        description: 'Retrieve songs by a comma-separated list of IDs or by a direct link to the song on JioSaavn.',
        operationId: 'getSongByIdsOrLink',
        request: {
          query: z.object({
            ids: z.string().optional().openapi({
              title: 'Song IDs',
              description: 'Comma-separated list of song IDs',
              type: 'string',
              example: '3IoDK8qI,4IoDK8qI,5IoDK8qI'
            }),
            link: z
              .string()
              .url()
              .optional()
              .transform((value) => value?.match(/jiosaavn\.com\/song\/[^/]+\/([^/]+)$/)?.[1])
              .openapi({
                title: 'Song Link',
                description: 'A direct link to the song on JioSaavn',
                type: 'string',
                example: 'https://www.jiosaavn.com/song/houdini/OgwhbhtDRwM'
              })
          })
        },
        responses: {
          200: {
            description: 'Successful response with song details',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(SongModel).openapi({
                    title: 'Song Details',
                    description: 'Array of song details'
                  })
                })
              }
            }
          },
          400: { description: 'Bad request when query parameters are missing or invalid' },
          404: { description: 'Song not found with the given ID or link' }
        }
      }),
      async (ctx) => {
        const { link, ids } = ctx.req.valid('query')

        if (!link && !ids) {
          return ctx.json({ success: false, message: 'Either song IDs or link is required' }, 400)
        }

        const response = link
          ? await this.songService.getSongByLink(link)
          : await this.songService.getSongByIds({ songIds: ids! })

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/songs/auth-url',
        tags: ['Songs'],
        summary: 'Generate an authenticated streaming URL',
        description:
          'Exchange an encrypted media URL (as found on a song or podcast episode download link) for a signed, directly playable streaming URL.',
        operationId: 'generateSongAuthUrl',
        request: {
          query: z.object({
            url: z.string().openapi({
              title: 'Encrypted media URL',
              description: 'The encrypted_media_url of a song or episode',
              type: 'string',
              example:
                'ID2ieOjCrwesDbErZOIw11Wwf+RHa1nbaWV68KA/Hj50kpcCBayTEo42h48Vy5EDyeZ4hSU1PsS8ycJqa8/xSwKCUoZqnL2bbkj1S6kifCg='
            }),
            bitrate: z.enum(['12', '48', '96', '128', '160', '320']).optional().openapi({
              title: 'Bitrate',
              description: 'Requested audio bitrate',
              type: 'string',
              example: '128',
              default: '128'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with a signed streaming URL',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.object({
                    url: z.string().openapi({ description: 'The signed, directly playable streaming URL' })
                  })
                })
              }
            }
          },
          400: { description: 'Bad request when url is missing' },
          404: { description: 'Unable to generate an auth URL for the given input' }
        }
      }),
      async (ctx) => {
        const { url, bitrate } = ctx.req.valid('query')

        const authUrl = await this.songService.generateAuthToken({ url, bitrate })

        return ctx.json({ success: true, data: { url: authUrl } })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/songs/{id}',
        tags: ['Songs'],
        summary: 'Retrieve song by ID',
        description: 'Retrieve a song by its ID. Optionally, include lyrics in the response.',
        operationId: 'getSongById',
        request: {
          params: z.object({
            id: z.string().openapi({
              title: 'Song ID',
              description: 'ID of the song to retrieve',
              type: 'string',
              example: '3IoDK8qI'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with song details',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(SongModel).openapi({
                    description: 'Array of songs'
                  })
                })
              }
            }
          },
          400: { description: 'Bad request when query parameters are missing or invalid' },
          404: { description: 'Song not found for the given ID' }
        }
      }),
      async (ctx) => {
        const songId = ctx.req.param('id')

        const response = await this.songService.getSongByIds({ songIds: songId })

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/songs/{id}/suggestions',
        tags: ['Songs'],
        summary: 'Retrieve song suggestions',
        description:
          'Retrieve song suggestions based on the given song ID. This can be used to get similar songs to the one provided for infinite playback.',
        operationId: 'getSongSuggestions',
        request: {
          params: z.object({
            id: z.string().openapi({
              description: 'ID of the song to retrieve suggestions for',
              type: 'string',
              example: 'yDeAS8Eh'
            })
          }),
          query: z.object({
            limit: z.string().pipe(z.coerce.number()).optional().openapi({
              description: 'Limit the number of suggestions to retrieve',
              type: 'number',
              title: 'Limit',
              example: '10',
              default: '10'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with song suggestions',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(SongModel).openapi({
                    description: 'Array of song suggestions'
                  })
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const songId = ctx.req.param('id')
        const { limit } = ctx.req.valid('query')

        const suggestions = await this.songService.getSongSuggestions({ songId, limit: limit || 10 })

        return ctx.json({ success: true, data: suggestions })
      }
    )
  }
}
