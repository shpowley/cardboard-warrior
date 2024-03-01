import { memo, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

import { DICE_STATE, useStateDice } from '../../../stores/useStateDice'
import { ANIMATION_STATE, useStateAnimation } from '../../../stores/useStateAnimation'
import { useStateBGM } from '../../../stores/useStateBGM'
import { FILES } from '../../../common/Constants'
import { randomFloat } from '../../../common/Utils'

// FACE ID LOOKUP TABLE -- SPECIFIC TO THIS MODEL ONLY!
// SEE NOTES.TXT ON HOW TO DETERMINE FACE IDS -- PROGRAMATIC RAYCASTER TRIAL-AND-ERROR
const FACE_ID_LOOKUP = {
  1063: 1,
  154: 2,
  744: 3,
  174: 4,
  695: 5,
  278: 6,
  926: 7,
  210: 8,
  635: 9,
  408: 10,
  623: 11,
  419: 12,
  796: 13,
  119: 14,
  775: 15,
  291: 16,
  755: 17,
  244: 18,
  900: 19,
  0: 20
}

useGLTF.preload(FILES.D20_MODEL)

const getRandomPosition = () => ({
  x: randomFloat(1, 4),
  y: randomFloat(6, 10),
  z: randomFloat(1, 6)
})

const D20 = ({ castShadow = false, position, visible = false }) => {
  const ref_d20 = {
    body: useRef(),
    mesh: useRef(),
  }

  // ZUSTAND
  const
    setDiceState = useStateDice(state => state.setDiceStatePlayer),
    setDiceValue = useStateDice(state => state.setDiceValuePlayer)

  let sound_enabled = true

  const { nodes, materials } = useGLTF(FILES.D20_MODEL)

  const
    [dice_sound] = useState({
      media: new Audio(FILES.SOUND_HIT),
      is_playing: false,
    })

  dice_sound.media.onended = () => {
    dice_sound.is_playing = false
  }

  const rollD20 = () => {

    // don't roll if the d20 is already rolling
    if (!ref_d20.body.current || !ref_d20.body.current.isSleeping()) return

    // reset the d20 prior to rolling
    ref_d20.body.current.setAngvel({ x: 0, y: 0, z: 0 })
    ref_d20.body.current.setLinvel({ x: 0, y: 0, z: 0 })

    // apply a random force and spin
    ref_d20.body.current.applyImpulse({
      x: randomFloat(-75, 75), // left/right force
      y: randomFloat(35, 45), // upward force
      z: randomFloat(-75, 75) // forward force
    }, true)

    ref_d20.body.current.applyTorqueImpulse({
      x: randomFloat(-8, 8), // forward spin
      y: 0,
      z: randomFloat(-8, 8) // left/right spin
    }, true)
  }

  const handleDiceSound = force => {
    if (sound_enabled && force > 100 && !dice_sound.is_playing) {
      dice_sound.media.currentTime = 0
      dice_sound.media.volume = Math.min(force / 2000, 1)

      dice_sound.media.play()
        .then(() => dice_sound.is_playing = true)
        .catch(err => dice_sound.is_playing = false)
    }
  }

  // GET THE FACE OF THE D20 THAT IS FACING UP
  const handleRollComplete = () => {
    // DICE ROLL COMPLETE
    if (useStateDice.getState().dice_state_player === DICE_STATE.ROLLING) {
      const d20_position = ref_d20.mesh.current.getWorldPosition(new THREE.Vector3())
      const raycaster = new THREE.Raycaster()

      raycaster.set(
        new THREE.Vector3(d20_position.x, d20_position.y + 1, d20_position.z), // START POSITION ABOVE THE D20
        new THREE.Vector3(0, -1, 0) // DIRECTION DOWN
      )

      const intersect = raycaster.intersectObject(ref_d20.mesh.current, true)

      const dice_roll_value = FACE_ID_LOOKUP[intersect[0].faceIndex] ?? 1

      // ZUSTAND DICE ROLL COMPLETE
      setDiceValue(dice_roll_value)
      setDiceState(DICE_STATE.ROLL_COMPLETE)
    }

    // DICE SHOW ANIMATION COMPLETE
    else if (useStateDice.getState().dice_state_player === DICE_STATE.FALLING) {
      setDiceState(DICE_STATE.FALL_COMPLETE)
    }
  }

  useFrame(() => {
    if (
      useStateDice.getState().dice_state_player === DICE_STATE.HIDING
      && ref_d20.body.current.translation().y >= 12
    ) {
      ref_d20.body.current.setLinvel({ x: 0, y: 0, z: 0 })
      ref_d20.body.current.setAngvel({ x: 0, y: 0, z: 0 })
      ref_d20.body.current.setGravityScale(0)
      ref_d20.body.current.sleep()
      ref_d20.mesh.current.visible = false
      setDiceState(DICE_STATE.HIDE_COMPLETE)
    }
  })

  useEffect(() => {
    // DICE ROLL TRIGGER SUBSCRIPTION (ZUSTAND)
    const subscribe_dice_roll = useStateDice.subscribe(
      // SELECTOR
      state => state.dice_state_player,

      // CALLBACK
      dice_state_subscribed => {
        if (dice_state_subscribed === DICE_STATE.ROLLING) {
          rollD20()
        }
      }
    )

    // DICE HIDE/SHOW ANIMATION SUBSCRIPTION (ZUSTAND)
    const subscribe_dice_animation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.dice_animation_state,

      // CALLBACK
      dice_animation_state => {
        if (dice_animation_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
          setTimeout(() => {
            ref_d20.body.current.setTranslation(getRandomPosition())
            ref_d20.body.current.setGravityScale(1)
            ref_d20.body.current.wakeUp()
            ref_d20.mesh.current.visible = true
            setDiceState(DICE_STATE.FALLING)
          }, useStateAnimation.getState().dice_animation_delay)
        }
        else if (dice_animation_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
          setTimeout(() => {
            ref_d20.body.current.setGravityScale(-(0.2 + 0.5 * Math.random()))
            ref_d20.body.current.wakeUp()
            setDiceState(DICE_STATE.HIDING)
          }, useStateAnimation.getState().dice_animation_delay)
        }
      }
    )

    // ZUSTAND SOUND ENABLED
    const subscribe_sound_enabled = useStateBGM.subscribe(
      // SELECTOR
      state => state.sound_enabled,

      // CALLBACK
      sound_enabled_subscribed => {
        sound_enabled = sound_enabled_subscribed
      }
    )

    // CLEANUP
    return () => {
      subscribe_dice_roll()
      subscribe_dice_animation()
      subscribe_sound_enabled()
    }
  }, [])

  return <RigidBody
    ref={ref_d20.body}
    position={position ?? Object.values(getRandomPosition())}
    rotation={[Math.random(), 0, Math.random()]}
    colliders='hull'
    mass={1}
    restitution={0.4}
    friction={0.3}
    gravityScale={0}
    includeInvisible={true}

    onSleep={handleRollComplete}
    onContactForce={payload => handleDiceSound(payload.totalForceMagnitude)}
  >
    <group
      ref={ref_d20.mesh}
      visible={visible}
    >
      <mesh
        geometry={nodes.d20_red_plastic.geometry}
        material={materials['red plastic']}
        castShadow={castShadow}
      />
    </group>
  </RigidBody>
}

export default memo(D20)