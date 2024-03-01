import { useState, useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

import { TRACKS, useStateBGM } from '../stores/useStateBGM'
import { GAME_PHASE, useStateGame } from '../stores/useStateGame'
import { useStatePlayer } from '../stores/useStatePlayer'
import { ANIMATION_STATE, useStateAnimation } from '../stores/useStateAnimation'

/** BACKGROUND MUSIC
 *  - BASED ON https://threejs.org/docs/?q=audio#api/en/audio/Audio
 *  - THERE IS A POSITIONAL AUDIO DREI HELPER, BUT THERE DOESN'T SEEM TO BE A GENERIC AUDIO COMPONENT IN REACT THREE FIBER
 */
const listener = new THREE.AudioListener()

const BackgroundMusic = () => {
  const camera = useThree(state => state.camera)
  const [bgm] = useState(new THREE.Audio(listener))

  // ZUSTAND
  const
    setTrack = useStateBGM(state => state.setTrack)

  useEffect(() => {
    camera.add(listener)

    // ZUSTAND BGM TRACK
    const subscribe_bgm_track = useStateBGM.subscribe(
      // SELECTOR
      state => state.track,

      // CALLBACK
      track_subscribed => {
        const sound_enabled = useStateBGM.getState().sound_enabled

        if (bgm.isPlaying) {
          bgm.stop()
        }

        if (!sound_enabled || track_subscribed === TRACKS.NONE) {
          return
        }

        const audio_loader = new THREE.AudioLoader()
        const volume = useStateBGM.getState().volume

        audio_loader.loadAsync(track_subscribed).then(buffer => {
          bgm.setBuffer(buffer)
          bgm.setLoop(true)
          bgm.setVolume(volume)
          bgm.play(0.1)
        })
      }
    )

    // ZUSTAND BGM VOLUME
    const subscribe_bgm_volume = useStateBGM.subscribe(
      // SELECTOR
      state => state.volume,

      // CALLBACK
      volume_subscribed => {
        bgm.setVolume(volume_subscribed)
      }
    )

    // ZUSTAND BGM SOUND ENABLED
    const subscribe_bgm_enabled = useStateBGM.subscribe(
      // SELECTOR
      state => state.sound_enabled,

      // CALLBACK
      sound_enabled => {
        if (!sound_enabled && bgm.isPlaying) {
          bgm.stop()
        }
      }
    )

    // MUSIC TRACKS
    const subscribe_game_phase = useStateGame.subscribe(
      // SELECTOR
      state => state.phase,

      // CALLBACK
      phase_subscribed => {
        if (phase_subscribed === GAME_PHASE.GAME_START) {
          setTrack(TRACKS.TITLE)
        }
      }
    )

    const subscribe_monster_animation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.monster_sign_animation_state,

      // CALLBACK
      animation_state => {
        if (animation_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
          const
            active_room = useStatePlayer.getState().room,
            monster = active_room.monster

          if (monster) {
            const level_data = useStateGame.getState().level

            setTrack(active_room.index === level_data.room_end.index
              ? TRACKS.DECISIVE_BATTLE
              : TRACKS.BATTLE
            )
          }
        }
        else if (animation_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
          setTrack(TRACKS.TITLE)
        }
      }
    )

    // CLEANUP
    return () => {
      camera.remove(listener)
      subscribe_bgm_track()
      subscribe_bgm_volume()
      subscribe_bgm_enabled()
      subscribe_game_phase()
      subscribe_monster_animation()
    }
  }, [])

  return <></>
}

export default BackgroundMusic