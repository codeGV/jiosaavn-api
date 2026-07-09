import {
  CreateFeaturedStationUseCase,
  GetFeaturedStationsUseCase,
  GetStationSongsUseCase,
  type CreateFeaturedStationArgs,
  type GetStationSongsArgs
} from '#modules/radio/use-cases'

export class RadioService {
  private readonly getFeaturedStationsUseCase: GetFeaturedStationsUseCase
  private readonly createFeaturedStationUseCase: CreateFeaturedStationUseCase
  private readonly getStationSongsUseCase: GetStationSongsUseCase

  constructor() {
    this.getFeaturedStationsUseCase = new GetFeaturedStationsUseCase()
    this.createFeaturedStationUseCase = new CreateFeaturedStationUseCase()
    this.getStationSongsUseCase = new GetStationSongsUseCase()
  }

  getFeaturedStations = () => {
    return this.getFeaturedStationsUseCase.execute()
  }

  createFeaturedStation = (args: CreateFeaturedStationArgs) => {
    return this.createFeaturedStationUseCase.execute(args)
  }

  getStationSongs = (args: GetStationSongsArgs) => {
    return this.getStationSongsUseCase.execute(args)
  }
}
