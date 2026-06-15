import { DashboardModel } from '#modules/dashboard/models'
import { DashboardController } from '#modules/index'
import { beforeAll, describe, expect, it } from 'vitest'
import type { z } from 'zod'

describe('DashboardController', () => {
  let albumController: DashboardController

  beforeAll(() => {
    albumController = new DashboardController()
    albumController.initRoutes()
  })

  it('retrieve album by link', async () => {
    const response = await albumController.controller.request(
      '/dashboard?link=https://www.jiosaavn.com/album/future-nostalgia/ITIyo-GDr7A_'
    )

    const { data } = (await response.json()) as { data: z.infer<typeof DashboardModel> }
    expect(() => DashboardModel.parse(data)).not.toThrow()
  })

  it('retrieve album by id', async () => {
    const response = await albumController.controller.request('/dashboard?id=23241654')

    const { data } = (await response.json()) as { data: z.infer<typeof DashboardModel> }
    expect(() => DashboardModel.parse(data)).not.toThrow()
  })
})
