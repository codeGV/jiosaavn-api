import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { RadioStationModel } from '#modules/radio/models'
import { RadioService } from '#modules/radio/services'
import { SongModel } from '#modules/songs/models'
import { z } from 'zod'
import type { Routes } from '#common/types'

export class RadioController implements Routes {
  public controller: OpenAPIHono
  private radioService: RadioService

  constructor() {
    this.controller = new OpenAPIHono()
    this.radioService = new RadioService()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/radio/featured-stations',
        tags: ['Radio'],
        summary: 'Retrieve featured radio stations',
        description: 'Retrieve the list of JioSaavn featured/mood radio stations.',
        operationId: 'getFeaturedStations',
        responses: {
          200: {
            description: 'Successful response with featured radio stations',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(RadioStationModel).openapi({
                    title: 'Featured Stations',
                    description: 'Array of featured radio stations'
                  })
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const response = await this.radioService.getFeaturedStations()

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/radio/stations',
        tags: ['Radio'],
        summary: 'Create a radio station',
        description:
          'Create a radio station from a song/artist name, a search query, or an artist ID, optionally scoped to a language. Returns a station ID to be used with the station songs endpoint.',
        operationId: 'createFeaturedStation',
        request: {
          query: z.object({
            name: z.string().optional().openapi({
              title: 'Name',
              description: 'Song or artist name to base the station on',
              type: 'string',
              example: 'Khadke Glassy'
            }),
            query: z.string().optional().openapi({
              title: 'Query',
              description: 'Free-text search query to base the station on',
              type: 'string',
              example: 'Khadke Glassy'
            }),
            artistId: z.string().optional().openapi({
              title: 'Artist ID',
              description: 'Artist ID to base the station on',
              type: 'string',
              example: '459320'
            }),
            language: z.string().optional().openapi({
              title: 'Language',
              description: 'Language to scope the station to',
              type: 'string',
              example: 'punjabi'
            }),
            pid: z.string().optional().openapi({
              title: 'PID',
              description: 'Optional partner/profile ID',
              type: 'string'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with the created station ID',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.object({
                    stationId: z.string().openapi({ description: 'ID of the created radio station' })
                  })
                })
              }
            }
          },
          400: { description: 'Bad request when name, query and artistId are all missing' },
          500: { description: 'Could not create a radio station for the given input' }
        }
      }),
      async (ctx) => {
        const { name, query, artistId, language, pid } = ctx.req.valid('query')

        if (!name && !query && !artistId) {
          return ctx.json({ success: false, message: 'Either name, query or artistId is required' }, 400)
        }

        const stationId = await this.radioService.createFeaturedStation({ name, query, artistId, language, pid })

        return ctx.json({ success: true, data: { stationId } })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/radio/stations/{stationId}/songs',
        tags: ['Radio'],
        summary: 'Retrieve songs for a radio station',
        description:
          'Retrieve a batch of songs for a radio station created via the create station endpoint. Call again with `next=true` to fetch the next batch for continuous playback.',
        operationId: 'getStationSongs',
        request: {
          params: z.object({
            stationId: z.string().openapi({
              title: 'Station ID',
              description: 'ID of the radio station, as returned by the create station endpoint',
              type: 'string',
              example: 'Y7jqGyht-E5p2,f7h046e4doToitONTK4tlhM53gYEBuH0XH3Lnt5w__'
            })
          }),
          query: z.object({
            count: z.string().pipe(z.coerce.number()).optional().openapi({
              title: 'Count',
              description: 'Number of songs to retrieve',
              type: 'number',
              example: '20',
              default: '20'
            }),
            next: z
              .enum(['true', 'false'])
              .optional()
              .transform((value) => value === 'true')
              .openapi({
                title: 'Next',
                description: 'Whether to fetch the next batch of songs for this station',
                type: 'boolean',
                example: 'false',
                default: 'false'
              })
          })
        },
        responses: {
          200: {
            description: 'Successful response with a batch of songs for the station',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(SongModel).openapi({
                    description: 'Array of songs for the station'
                  })
                })
              }
            }
          },
          404: { description: 'No songs found for the given station ID' }
        }
      }),
      async (ctx) => {
        const stationId = ctx.req.param('stationId')
        const { count, next } = ctx.req.valid('query')

        const response = await this.radioService.getStationSongs({ stationId, count: count || 20, next })

        return ctx.json({ success: true, data: response })
      }
    )
  }
}
