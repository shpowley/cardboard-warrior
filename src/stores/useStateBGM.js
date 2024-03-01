import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const TRACKS = {
  NONE: null,
  BATTLE: './music/battle.mp3',
  DECISIVE_BATTLE: './music/decisive-battle.mp3',
  TITLE: './music/title.mp3'
}

const useStateBGM = create(
  subscribeWithSelector(
    set => ({
      /** PROPERTIES */
      track: TRACKS.NONE,
      volume: 0.02,
      sound_enabled: true,

      /** METHODS */
      setTrack: new_track => set(
        track => new_track === track ? {} : {track: new_track}
      ),

      setVolume: new_volume => set(
        volume => {new_volume > 0 && new_volume <= 1 ? new_volume : volume}
      ),

      setSoundEnabled: sound_enabled => set({sound_enabled})
    })
  )
)

export { TRACKS, useStateBGM }