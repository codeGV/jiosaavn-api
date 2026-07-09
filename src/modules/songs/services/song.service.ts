import {
  CreateSongStationUseCase,
  GenerateSongAuthTokenUseCase,
  GetSongByIdUseCase,
  GetSongByLinkUseCase,
  GetSongSuggestionsUseCase,
  type GenerateSongAuthTokenArgs,
  type GetSongByIdArgs,
  type GetSongSuggestionsArgs
} from '#modules/songs/use-cases'

export class SongService {
  private readonly getSongByIdUseCase: GetSongByIdUseCase
  private readonly getSongByLinkUseCase: GetSongByLinkUseCase
  private readonly createSongStationUseCase: CreateSongStationUseCase
  private readonly getSongSuggestionsUseCase: GetSongSuggestionsUseCase
  private readonly generateSongAuthTokenUseCase: GenerateSongAuthTokenUseCase

  constructor() {
    this.getSongByIdUseCase = new GetSongByIdUseCase()
    this.getSongByLinkUseCase = new GetSongByLinkUseCase()
    this.createSongStationUseCase = new CreateSongStationUseCase()
    this.getSongSuggestionsUseCase = new GetSongSuggestionsUseCase()
    this.generateSongAuthTokenUseCase = new GenerateSongAuthTokenUseCase()
  }

  getSongByIds = (args: GetSongByIdArgs) => {
    return this.getSongByIdUseCase.execute(args)
  }

  getSongByLink = (token: string) => {
    return this.getSongByLinkUseCase.execute(token)
  }

  createSongStation = (songIds: string) => {
    return this.createSongStationUseCase.execute(songIds)
  }

  getSongSuggestions = (args: GetSongSuggestionsArgs) => {
    return this.getSongSuggestionsUseCase.execute(args)
  }

  generateAuthToken = (args: GenerateSongAuthTokenArgs) => {
    return this.generateSongAuthTokenUseCase.execute(args)
  }
}
