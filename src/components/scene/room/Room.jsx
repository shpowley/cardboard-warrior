import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

import { useStateGame } from '../../../stores/useStateGame'
import { useStatePlayer } from '../../../stores/useStatePlayer'
import { ANIMATION_STATE, useStateAnimation } from '../../../stores/useStateAnimation'
import { POSITIONING_ADJUST, ROOM_COLLIDER } from './Constants'
import { DIRECTION } from '../../../common/Constants'
import { DIRECTION as LEVEL_DIRECTION } from '../../../common/Level'
import ANIMATIONS from '../../../common/Animation'
import { mouse_pointer } from '../../../common/Utils'
import Floor from './Floor'
import Wall from './Wall'
import Ceiling from './Ceiling'
import DoorIndicator from './DoorIndicator'

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
  const ref_walls = {
    north: {
      wall: useRef(),
      door: useRef(),
      arrow: useRef()
    },

    south: {
      wall: useRef(),
      door: useRef(),
      arrow: useRef()
    },

    east: {
      wall: useRef(),
      door: useRef(),
      arrow: useRef()
    },

    west: {
      wall: useRef(),
      door: useRef(),
      arrow: useRef()
    }
  }

  // ANIMATIONS (anime.js)
  const animation_room = useRef()

  const camera = useThree(state => state.camera)
  const controls = useStateGame(state => state.controls)

  // ZUSTAND ANIMATION STATE
  const setWallAnimationState = useStateAnimation(state => state.setWallAnimationState)

  /** WALL VISIBLE LOGIC
   * - WALLS ARE AUTOMATICALLY HIDDEN DUE TO BACKFACE CULLING, BUT DOORS ARE NOT
   * - THIS SAME LOGIC COULD HIDE OTHER MESHES 'ATTACHED' TO A WALL (E.G. PAINTINGS, FLAGS, TORCHES, ETC.)
   * ! THIS ASSUMES THE CAMERA IS ALWAYS LOOKING AT [0, 0, 0]
   *
   * THE FOLLOWING DISCUSSION MIGHT PROVIDE A BETTER SOLUTION (DOT PRODUCT OF CAMERA DIRECTION AND WALL NORMALS)
   * * https://discourse.threejs.org/t/is-it-possible-to-make-a-3d-wall-visible-only-from-one-side-in-three-js/57521/7
   */
  const checkWallsVisible = () => {
    if (camera && useStateAnimation.getState().wall_animation_state !== ANIMATION_STATE.HIDDEN) {
      let angle_radians = Math.atan2(
        camera.position.x,
        camera.position.z
      )

      const camera_yaw = THREE.MathUtils.radToDeg(angle_radians)

      ref_walls.north.wall.current.visible = !calculateRange(180, camera_yaw)
      ref_walls.south.wall.current.visible = !calculateRange(0, camera_yaw)
      ref_walls.east.wall.current.visible = !calculateRange(90, camera_yaw)
      ref_walls.west.wall.current.visible = !calculateRange(-90, camera_yaw)
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
    const subscribe_animation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.wall_animation_state,

      // CALLBACK
      animation_state => {
        if (![ANIMATION_STATE.ANIMATING_TO_VISIBLE, ANIMATION_STATE.ANIMATING_TO_HIDE].includes(animation_state)) {
          return
        }

        const active_room = useStatePlayer.getState().room

        let target_arrows

        if (animation_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
          if (active_room) {
            target_arrows = []

            // NORTH WALL
            if (active_room.doors.N || (active_room.level_door && active_room.level_door === LEVEL_DIRECTION.N)) {
              ref_walls.north.door.current.visible = true
              ref_walls.north.arrow.current.visible = true
              ref_walls.north.arrow.current.__r3f.handlers.onPointerOver = mouse_pointer.over
              ref_walls.north.arrow.current.__r3f.handlers.onPointerOut = mouse_pointer.out
              target_arrows.push(ref_walls.north.arrow.current.material)
            }
            else {
              ref_walls.north.door.current.visible = false
              ref_walls.north.arrow.current.visible = false
              delete ref_walls.north.arrow.current.__r3f.handlers.onPointerOver
              delete ref_walls.north.arrow.current.__r3f.handlers.onPointerOut
            }

            // SOUTH WALL
            if (active_room.doors.S || (active_room.level_door && active_room.level_door === LEVEL_DIRECTION.S)) {
              ref_walls.south.door.current.visible = true
              ref_walls.south.arrow.current.visible = true
              ref_walls.south.arrow.current.__r3f.handlers.onPointerOver = mouse_pointer.over
              ref_walls.south.arrow.current.__r3f.handlers.onPointerOut = mouse_pointer.out
              target_arrows.push(ref_walls.south.arrow.current.material)
            }
            else {
              ref_walls.south.door.current.visible = false
              ref_walls.south.arrow.current.visible = false
              delete ref_walls.south.arrow.current.__r3f.handlers.onPointerOver
              delete ref_walls.south.arrow.current.__r3f.handlers.onPointerOut
            }

            // EAST WALL
            if (active_room.doors.E || (active_room.level_door && active_room.level_door === LEVEL_DIRECTION.E)) {
              ref_walls.east.door.current.visible = true
              ref_walls.east.arrow.current.visible = true
              ref_walls.east.arrow.current.__r3f.handlers.onPointerOver = mouse_pointer.over
              ref_walls.east.arrow.current.__r3f.handlers.onPointerOut = mouse_pointer.out
              target_arrows.push(ref_walls.east.arrow.current.material)
            }
            else {
              ref_walls.east.door.current.visible = false
              ref_walls.east.arrow.current.visible = false
              delete ref_walls.east.arrow.current.__r3f.handlers.onPointerOver
              delete ref_walls.east.arrow.current.__r3f.handlers.onPointerOut
            }

            // WEST WALL
            if (active_room.doors.W || (active_room.level_door && active_room.level_door === LEVEL_DIRECTION.W)) {
              ref_walls.west.door.current.visible = true
              ref_walls.west.arrow.current.visible = true
              ref_walls.west.arrow.current.__r3f.handlers.onPointerOver = mouse_pointer.over
              ref_walls.west.arrow.current.__r3f.handlers.onPointerOut = mouse_pointer.out
              target_arrows.push(ref_walls.west.arrow.current.material)
            }
            else {
              ref_walls.west.door.current.visible = false
              ref_walls.west.arrow.current.visible = false
              delete ref_walls.west.arrow.current.__r3f.handlers.onPointerOver
              delete ref_walls.west.arrow.current.__r3f.handlers.onPointerOut
            }
          }

          checkWallsVisible()

          animation_room.current = ANIMATIONS.animateWallsShow({
            target_walls: ref_walls,
            target_arrows,
            delay: useStateAnimation.getState().wall_animation_delay
          })

          animation_room.current.complete = () => setWallAnimationState(ANIMATION_STATE.VISIBLE)
        }
        else if (animation_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
          if (active_room) {
            target_arrows = []

            if (ref_walls.north.arrow.current.visible) {
              target_arrows.push(ref_walls.north.arrow.current.material)
            }

            if (ref_walls.south.arrow.current.visible) {
              target_arrows.push(ref_walls.south.arrow.current.material)
            }

            if (ref_walls.east.arrow.current.visible) {
              target_arrows.push(ref_walls.east.arrow.current.material)
            }

            if (ref_walls.west.arrow.current.visible) {
              target_arrows.push(ref_walls.west.arrow.current.material)
            }
          }

          animation_room.current = ANIMATIONS.animateWallsHide({
            target_walls: ref_walls,
            target_arrows,
            delay: useStateAnimation.getState().wall_animation_delay
          })

          animation_room.current.complete = () => {
            if (target_arrows) {
              ref_walls.north.arrow.current.visible = false
              ref_walls.south.arrow.current.visible = false
              ref_walls.east.arrow.current.visible = false
              ref_walls.west.arrow.current.visible = false
            }

            setWallAnimationState(ANIMATION_STATE.HIDDEN)
          }
        }
      }
    )

    // CLEANUP
    return () => {
      subscribe_animation()
    }
  }, [])

  return <>
    <DoorIndicator />
    <Ceiling />
    <Floor />

    <Wall
      forward_ref={ref_walls.north}
      direction={DIRECTION.NORTH}
      position={[0, ROOM_COLLIDER.wall_position_y, -POSITIONING_ADJUST]}
    />

    <Wall
      forward_ref={ref_walls.south}
      direction={DIRECTION.SOUTH}
      position={[0, ROOM_COLLIDER.wall_position_y, POSITIONING_ADJUST]}
      rotation={[0, Math.PI, 0]}
    />

    <Wall
      forward_ref={ref_walls.east}
      direction={DIRECTION.EAST}
      position={[POSITIONING_ADJUST, ROOM_COLLIDER.wall_position_y, 0]}
      rotation={[0, -Math.PI * 0.5, 0]}
    />

    <Wall
      forward_ref={ref_walls.west}
      direction={DIRECTION.WEST}
      position={[-POSITIONING_ADJUST, ROOM_COLLIDER.wall_position_y, 0]}
      rotation={[0, Math.PI * 0.5, 0]}
    />
  </>
}

export default Room