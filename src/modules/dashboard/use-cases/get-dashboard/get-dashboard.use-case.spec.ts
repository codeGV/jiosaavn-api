import { DashboardModel } from '#modules/dashboard/models'
import { GetDashboardUseCase } from '#modules/dashboard/use-cases'
import { beforeAll, describe, expect, it } from 'vitest'

describe('GetDashboardById', () => {
  let getDashboardUseCase: GetDashboardUseCase

  beforeAll(() => {
    getDashboardUseCase = new GetDashboardUseCase()
  })

  it('should get album by id', async () => {
    const album = await getDashboardUseCase.execute('23241654')

    expect(() => DashboardModel.parse(album)).not.toThrow()
  })

  it('should not get album by id for wrong album id', async () => {
    const album = await getDashboardUseCase.execute('random-no-id')

    expect(() => DashboardModel.parse(album)).not.toThrow()
  })
})
