import { GetEpisodeUseCase, GetShowUseCase, type GetShowArgs } from '#modules/podcasts/use-cases'

export class PodcastService {
  private readonly getShowUseCase: GetShowUseCase
  private readonly getEpisodeUseCase: GetEpisodeUseCase

  constructor() {
    this.getShowUseCase = new GetShowUseCase()
    this.getEpisodeUseCase = new GetEpisodeUseCase()
  }

  getShow = (args: GetShowArgs) => {
    return this.getShowUseCase.execute(args)
  }

  getEpisode = (token: string) => {
    return this.getEpisodeUseCase.execute(token)
  }
}
