import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

import Floor from './Floor'
import Wall from './Wall'
import Ceiling from './Ceiling'
import Arrows from './Arrows'
import { useStateGame } from '../../../stores/useStateGame'
import { ANIMATION_STATE, useStateAnimation } from '../../../stores/useStateAnimation'
import { POSITIONING_ADJUST, ROOM_COLLIDER } from './Constants'
import ANIMATIONS from '../../../common/Animation'

// CALCULATE THE CAMERA'S ANGLE IN DEGREES
const calculateRange = (prime_angle, camera_yaw) => {
  let range = 66.5

  const
    prime_angle_upper = prime_angle === 180 ? -180 : prime_angle,
    lower_range_test = camera_yaw > prime_angle - range && camera_yaw <= prime_angle,
    upper_range_test = camera_yaw >= prime_angle_upper && camera_yaw < prime_angle_upper + range

  return lower_range_test || upper_range_test
}

const Room = () => {
  console.log('RENDER: Room')

  const ref_walls = {
    north: useRef(),
    south: useRef(),
    east: useRef(),
    west: useRef()
  }

  // ANIMATIONS (anime.js)
  const animation_room = useRef()

  const camera = useThree(state => state.camera)
  const controls = useStateGame(state => state.controls)

  // ZUSTAND ANIMATION STATE
  const setRoomAnimationState = useStateAnimation(state => state.setRoomAnimationState)

  /** WALL VISIBLE LOGIC
   * - WALLS ARE AUTOMATICALLY HIDDEN DUE TO BACKFACE CULLING, BUT DOORS ARE NOT
   * - THIS SAME LOGIC COULD HIDE OTHER MESHES 'ATTACHED' TO A WALL (E.G. PAINTINGS, FLAGS, TORCHES, ETC.)
   * ! THIS ASSUMES THE CAMERA IS ALWAYS LOOKING AT [0, 0, 0]
   */
  const checkWallsVisible = () => {
    if (camera && useStateAnimation.getState().room_animation_state !== ANIMATION_STATE.HIDDEN) {
      let angle_radians = Math.atan2(
        camera.position.x,
        camera.position.z
      )

      const camera_yaw = THREE.MathUtils.radToDeg(angle_radians)

      ref_walls.north.current.visible = !calculateRange(180, camera_yaw)
      ref_walls.south.current.visible = !calculateRange(0, camera_yaw)
      ref_walls.east.current.visible = !calculateRange(90, camera_yaw)
      ref_walls.west.current.visible = !calculateRange(-90, camera_yaw)
    }
  }

  useEffect(() => {
    if (controls) {
      controls.addEventListener('change', checkWallsVisible)

      // CLEANUP
      return () => {
        controls.removeEventListener('change', checkWallsVisible)
      }
    }
  }, [controls])

  useEffect(() => {
    // ANIMATION SUBSCRIPTION (ZUSTAND)
    const subscribeAnimation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.room_animation_state,

      // CALLBACK
      animation_state => {
        if (animation_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
          checkWallsVisible()
          animation_room.current = ANIMATIONS.animateRoomShow({ target_walls: ref_walls })
          animation_room.current.complete = () => setRoomAnimationState(ANIMATION_STATE.VISIBLE)
        }
        else if (animation_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
          animation_room.current = ANIMATIONS.animateRoomHide({ target_walls: ref_walls })
          animation_room.current.complete = () => setRoomAnimationState(ANIMATION_STATE.HIDDEN)
        }
      }
    )

    // CLEANUP
    return () => {
      subscribeAnimation()
    }
  }, [])

  return <>
    <Ceiling />
    <Floor />
    <Arrows />

    <Wall
      forward_ref={ref_walls.north}
      position={[0, ROOM_COLLIDER.wall_position_y, -POSITIONING_ADJUST]}
    />

    <Wall
      forward_ref={ref_walls.south}
      position={[0, ROOM_COLLIDER.wall_position_y, POSITIONING_ADJUST]}
      rotation={[0, Math.PI, 0]}
    />

    <Wall
      forward_ref={ref_walls.east}
      position={[POSITIONING_ADJUST, ROOM_COLLIDER.wall_position_y, 0]}
      rotation={[0, -Math.PI * 0.5, 0]}
    />

    <Wall
      forward_ref={ref_walls.west}
      position={[-POSITIONING_ADJUST, ROOM_COLLIDER.wall_position_y, 0]}
      rotation={[0, Math.PI * 0.5, 0]}
    />
  </>
}

export default Room