import {
  AlbumController,
  ArtistController,
  DashboardController,
  PodcastController,
  RadioController,
  SearchController,
  SongController
} from '#modules/index'
import process from 'node:process'
import { PlaylistController } from '#modules/playlists/controllers'
import { App } from './app'

const app = new App([
  new SearchController(),
  new SongController(),
  new AlbumController(),
  new ArtistController(),
  new PlaylistController(),
  new DashboardController(),
  new PodcastController(),
  new RadioController()
]).getApp()

export default {
  port: Number(process.env.PORT) || 3002,
  fetch: app.fetch
}
