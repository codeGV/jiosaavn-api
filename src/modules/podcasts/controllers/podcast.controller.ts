import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { EpisodeModel, PodcastModel } from '#modules/podcasts/models'
import { PodcastService } from '#modules/podcasts/services'
import { z } from 'zod'
import type { Routes } from '#common/types'

export class PodcastController implements Routes {
  public controller: OpenAPIHono
  private podcastService: PodcastService

  constructor() {
    this.controller = new OpenAPIHono()
    this.podcastService = new PodcastService()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/podcasts',
        tags: ['Podcasts'],
        summary: 'Retrieve a show by token or link',
        description:
          'Retrieve a JioSaavn show (podcast) with its seasons and the episodes of a given season, by token or by a direct show link.',
        operationId: 'getShowByTokenOrLink',
        request: {
          query: z.object({
            token: z.string().optional().openapi({
              title: 'Show token',
              description: 'The token segment at the end of the show perma_url',
              type: 'string',
              example: 'q3nfP8Sr8ZM_'
            }),
            link: z
              .string()
              .url()
              .optional()
              .transform((value) => value?.match(/jiosaavn\.com\/shows\/.+\/([^/]+)$/)?.[1])
              .openapi({
                title: 'Show Link',
                description: 'A direct link to the show on JioSaavn',
                type: 'string',
                example: 'https://www.jiosaavn.com/shows/shri-krishna-amritvani/1/q3nfP8Sr8ZM_'
              }),
            seasonNumber: z.string().pipe(z.coerce.number()).optional().openapi({
              title: 'Season number',
              description: 'The season number to retrieve episodes for',
              type: 'number',
              example: '1',
              default: '1'
            }),
            sortOrder: z.enum(['asc', 'desc']).optional().openapi({
              title: 'Sort order',
              description: 'Order to sort the season episodes by',
              type: 'string',
              example: 'desc'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with show, seasons and episode details',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: PodcastModel.openapi({
                    title: 'Podcast Details',
                    description: 'The show, its seasons, and the episodes of the requested season'
                  })
                })
              }
            }
          },
          400: { description: 'Bad request when neither token nor link is provided' },
          404: { description: 'Show not found for the given token or link' }
        }
      }),
      async (ctx) => {
        const { token, link, seasonNumber, sortOrder } = ctx.req.valid('query')

        if (!token && !link) {
          return ctx.json({ success: false, message: 'Either show token or link is required' }, 400)
        }

        const response = await this.podcastService.getShow({
          token: (link || token)!,
          seasonNumber,
          sortOrder
        })

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/podcasts/episodes',
        tags: ['Podcasts'],
        summary: 'Retrieve an episode by token or link',
        description:
          'Retrieve a single podcast episode, including its playable download links, by token or by a direct episode link.',
        operationId: 'getEpisodeByTokenOrLink',
        request: {
          query: z.object({
            token: z.string().optional().openapi({
              title: 'Episode token',
              description: 'The token segment at the end of the episode perma_url',
              type: 'string',
              example: 'vm3w9Vl2rqI_'
            }),
            link: z
              .string()
              .url()
              .optional()
              .transform((value) => value?.match(/jiosaavn\.com\/shows\/.+\/([^/]+)$/)?.[1])
              .openapi({
                title: 'Episode Link',
                description: 'A direct link to the episode on JioSaavn',
                type: 'string',
                example: 'https://www.jiosaavn.com/shows/muje-kon-puchta-tha-tere-bandgi-se-pahle-bhajan/vm3w9Vl2rqI_'
              })
          })
        },
        responses: {
          200: {
            description: 'Successful response with episode details',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: EpisodeModel.openapi({
                    title: 'Episode Details',
                    description: 'The detailed information of the episode'
                  })
                })
              }
            }
          },
          400: { description: 'Bad request when neither token nor link is provided' },
          404: { description: 'Episode not found for the given token or link' }
        }
      }),
      async (ctx) => {
        const { token, link } = ctx.req.valid('query')

        if (!token && !link) {
          return ctx.json({ success: false, message: 'Either episode token or link is required' }, 400)
        }

        const response = await this.podcastService.getEpisode((link || token)!)

        return ctx.json({ success: true, data: response })
      }
    )
  }
}
