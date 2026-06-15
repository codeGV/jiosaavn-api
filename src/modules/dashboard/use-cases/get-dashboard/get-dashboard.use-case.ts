import * as fs from 'node:fs'
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
    const { data } = await useFetch<z.infer<typeof DashboardAPIResponseModel>>({
      endpoint: Endpoints.dashboard,
      params: { language }
    })

    if (!data) throw new HTTPException(404, { message: 'Dashboard not found' })
    fs.writeFileSync('output.txt', JSON.stringify(data, null, 2))
    return createDashboardPayload(data)
  }
}
