import {
  AlbumController,
  ArtistController,
  DashboardController,
  SearchController,
  SongController
} from '#modules/index'
import { PlaylistController } from '#modules/playlists/controllers'
import { App } from './app'

const app = new App([
  new SearchController(),
  new SongController(),
  new AlbumController(),
  new ArtistController(),
  new PlaylistController(),
  new DashboardController()
]).getApp()

export default app
