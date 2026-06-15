import { GetDashboardUseCase } from '#modules/dashboard/use-cases'

export class DashboardService {
  private readonly getDashboardUseCase: GetDashboardUseCase

  constructor() {
    this.getDashboardUseCase = new GetDashboardUseCase()
  }

  getDashboardData = (albumId: string) => {
    return this.getDashboardUseCase.execute(albumId)
  }
}
