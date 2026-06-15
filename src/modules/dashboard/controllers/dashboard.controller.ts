import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { DashboardModel } from '#modules/dashboard/models'
import { DashboardService } from '#modules/dashboard/services'
import type { Routes } from '#common/types'

export class DashboardController implements Routes {
  public controller: OpenAPIHono
  private albumService: DashboardService

  constructor() {
    this.controller = new OpenAPIHono()
    this.albumService = new DashboardService()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/dashboard',
        tags: ['Dashboard'],
        summary: 'Retrieve an album by ID or link',
        description: 'Retrieve an album by providing either an ID or a direct link to the album on JioSaavn.',
        operationId: 'getDashboardByIdOrLink',
        request: {
          query: z.object({
            language: z.string().optional().openapi({
              title: 'langauges',
              description: 'english, hindi, punjabi, haryanvi',
              type: 'string',
              example: 'english, hindi, punjabi, haryanvi',
              default: 'english, hindi, punjabi, haryanvi'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with album details',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates the success status of the request.',
                    type: 'boolean',
                    example: true
                  }),
                  data: DashboardModel.openapi({
                    title: 'Dashboard Details',
                    description: 'The detailed information of the album.'
                  })
                })
              }
            }
          },
          400: { description: 'Bad request due to missing or invalid query parameters.' },
          404: { description: 'The album could not be found with the provided ID or link.' }
        }
      }),
      async (ctx) => {
        const { language } = ctx.req.valid('query')

        const response = await this.albumService.getDashboardData(language || '')

        return ctx.json({ success: true, data: response })
      }
    )
  }
}
