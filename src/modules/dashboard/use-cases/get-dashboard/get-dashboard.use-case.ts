import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { createDashboardPayload } from '#modules/dashboard/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '#common/types'
import type { DashboardAPIResponseModel, DashboardModel } from '#modules/dashboard/models'
import type { z } from 'zod'

export class GetDashboardUseCase implements IUseCase<string, z.infer<typeof DashboardModel>> {
  constructor() {}

  async execute(language: string) {
    const languages = language
      ?.split(',')
      .map((lang) => lang.trim())
      .filter(Boolean)

    const { data } = await useFetch<z.infer<typeof DashboardAPIResponseModel>>({
      endpoint: Endpoints.dashboard,
      params: {},
      cookies: languages?.length ? { L: languages.join(','), DL: languages[0] } : undefined
    })

    if (!data) throw new HTTPException(404, { message: 'Dashboard not found' })
    return createDashboardPayload(data)
  }
}
