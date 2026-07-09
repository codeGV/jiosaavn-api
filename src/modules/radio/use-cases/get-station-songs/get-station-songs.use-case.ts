import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { createSongPayload } from '#modules/songs/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '#common/types'
import type { SongAPIResponseModel, SongModel } from '#modules/songs/models'
import type { z } from 'zod'

export interface GetStationSongsArgs {
  stationId: string
  count?: number
  next?: boolean
}

export class GetStationSongsUseCase implements IUseCase<GetStationSongsArgs, z.infer<typeof SongModel>[]> {
  constructor() {}

  async execute({ stationId, count, next }: GetStationSongsArgs) {
    // JioSaavn returns { song, stationid } when k=1, but { "0": { song }, "1": { song }, ..., stationid }
    // for k>1, so both shapes need to be handled at runtime.
    const { data, ok } = await useFetch<Record<string, unknown>>({
      endpoint: Endpoints.radio.getSongs,
      params: {
        stationid: stationId,
        k: count || 20,
        next: next ? 1 : 0
      }
    })

    if (!data || !ok) throw new HTTPException(404, { message: 'no songs found for the given station' })

    if (data.song) return [createSongPayload(data.song as z.infer<typeof SongAPIResponseModel>)]

    const { stationid, ...songs } = data

    return Object.values(songs)
      .map((element) => (element as { song?: z.infer<typeof SongAPIResponseModel> } | undefined)?.song)
      .filter((song): song is z.infer<typeof SongAPIResponseModel> => Boolean(song))
      .map(createSongPayload)
  }
}
