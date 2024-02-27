import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Image } from '@react-three/drei'

import { useStateGame } from '../../../stores/useStateGame'
import { useStatePlayer } from '../../../stores/useStatePlayer'
import { ANIMATION_STATE, useStateAnimation } from '../../../stores/useStateAnimation'
import HUDImages from '../../../common/HUDImages'

const DoorIndicator = () => {
  const ref_indicator = useRef()

  useEffect(() => {
    // ROOM SUBSCRIPTION (ZUSTAND)
    const subscribe_animation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.wall_animation_state,

      // CALLBACK
      wall_animation_state => {
        if (wall_animation_state !== ANIMATION_STATE.VISIBLE) {
          if (ref_indicator.current.visible) {
            ref_indicator.current.visible = false
          }

          return
        }

        const
          level_data = useStateGame.getState().level,
          active_room = useStatePlayer.getState().room

        let
          show_indicator = false,
          indicator_direction,
          HUD_image,
          adjacent_room_id

        // STARTING ROOM
        if (active_room.index === level_data.room_start.index) {
          if (active_room.level_door) {
            show_indicator = true
            indicator_direction = active_room.level_door
            HUD_image = HUDImages.RED_X
          }
        }

        // ENDING ROOM
        else if (active_room.index === level_data.room_end.index) {
          if (active_room.level_door) {
            show_indicator = true
            indicator_direction = active_room.level_door
            HUD_image = HUDImages.EXIT
          }
        }

        // ALL OTHER ROOMS (CHECK FOR DOOR LEADING TO BOSS ROOM)
        else {
          for (const [direction, is_door] of Object.entries(active_room.doors)) {
            if (is_door) {
              adjacent_room_id = active_room.adjacent_blocks.find(block => block.direction === direction).index

              if (adjacent_room_id === level_data.room_end.index) {
                show_indicator = true
                indicator_direction = direction
                HUD_image = HUDImages.MONSTER
                break
              }
            }
          }
        }

        // SET INDICATOR
        const indicator = ref_indicator.current

        if (show_indicator) {
          indicator.material.map = new THREE.TextureLoader().load(HUD_image.path)
          indicator.scale.set(...HUD_image.scale)

          switch (indicator_direction) {
            case 'N':
              indicator.rotation.set(0, 0, 0)
              indicator.position.set(0, 1.5, -7.5)
              break

            case 'S':
              indicator.rotation.set(0, Math.PI, 0)
              indicator.position.set(0, 1.5, 7.5)
              break

            case 'E':
              indicator.rotation.set(0, -Math.PI * 0.5, 0)
              indicator.position.set(7.5, 1.5, 0)
              break

            case 'W':
              indicator.rotation.set(0, Math.PI * 0.5, 0)
              indicator.position.set(-7.5, 1.5, 0)
              break
          }

          indicator.visible = true
        }
      }
    )

    // CLEANUP
    return () => {
      subscribe_animation()
    }
  }, [])

  return <Image
    ref={ref_indicator}
    visible={false}
    transparent
    url={HUDImages.RED_X.path}
  />
}

export default memo(DoorIndicator)