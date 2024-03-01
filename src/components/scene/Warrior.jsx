import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useAnimations, useGLTF } from '@react-three/drei'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'

import { LEVA_SORT_ORDER } from '../../common/Constants'
import { useStatePlayer } from '../../stores/useStatePlayer'
import { DICE_STATE, useStateDice } from '../../stores/useStateDice'
import { ANIMATION_STATE, useStateAnimation } from '../../stores/useStateAnimation'
import { POSITIONS } from '../../common/Positions'
import ANIMATIONS from '../../common/Animation'

/** BUILT-IN MESH ANIMATIONS
 *  - idle, idle_block, slash, walk.f, run.f
 */
const MESH_ANIMATIONS = {
  NONE: 'none',
  IDLE: 'idle',
  BLOCK: 'idle_block',
  SLASH: 'slash',
  WALK: 'walk.f',
  RUN: 'run.f',
}

const FILE_WARRIOR = './models/warrior-compressed.glb'

useGLTF.preload(FILE_WARRIOR)

const Warrior = ({ position, rotation, scale, visible = false, castShadow }) => {
  const { nodes, materials, animations } = useGLTF(FILE_WARRIOR)

  const ref_player = useRef()

  // ANIMATIONS (anime.js)
  const animation_player = useRef()

  // ZUSTAND STATE
  const
    setAnimation = useStatePlayer(state => state.setAnimation),
    setPlayerAnimationState = useStateAnimation(state => state.setPlayerAnimationState)

  // LEVA DEBUG CONTROLS
  useControls(
    'warrior animations',

    {
      selected_animation: {
        label: 'animation',
        options: MESH_ANIMATIONS,

        onChange: value => {
          setAnimation(value)
        }
      }
    },

    {
      collapsed: true,
      order: LEVA_SORT_ORDER.WARRIOR_ANIMATIONS
    }
  )

  // https://github.com/pmndrs/drei?tab=readme-ov-file#useStateAnimation
  // https://threejs.org/docs/#api/en/animation/AnimationMixer
  // https://threejs.org/docs/#api/en/animation/AnimationAction
  // https://codesandbox.io/s/pecl6
  const { mixer, actions } = useAnimations(animations, nodes._rootJoint)

  const onAnimationFinished = e => {
    mixer.removeEventListener('finished', onAnimationFinished)
    setAnimation(MESH_ANIMATIONS.IDLE)
  }

  // IDLE IS THE FALLBACK/COMPLETE ANIMATION THAT ALL OTHER ANIMATIONS TRANSITION TO
  // BLOCK ANIMATION IS A SPECIAL CASE IN THAT IT USES A TIMEOUT FOR A SMOOTH TRANSITION TO IDLE
  // -- I COULDN'T SEE HOW TO DO THIS WITH THE THREE.JS ANIMATION API
  const handleAnimation = selected_animation => {
    if (selected_animation === MESH_ANIMATIONS.NONE) {
      mixer.stopAllAction()
    }
    else {
      switch (selected_animation) {
        case MESH_ANIMATIONS.IDLE:
          actions[selected_animation]
            .reset()
            .setLoop(THREE.LoopRepeat)
            .fadeIn(0.5)
            .play()

          break

        case MESH_ANIMATIONS.BLOCK:
          actions[selected_animation]
            .reset()
            .setLoop(THREE.LoopRepeat)
            .fadeIn(0.5)
            .play()

          // SMOOTH TRANSITION TO IDLE
          setTimeout(() => {
            setAnimation(MESH_ANIMATIONS.IDLE)
          }, 3000)

          break

        case MESH_ANIMATIONS.SLASH:
          mixer.addEventListener('finished', onAnimationFinished)

          actions[selected_animation]
            .reset()
            .setLoop(THREE.LoopRepeat, 3)
            .fadeIn(0.5)
            .play()

          break

        case MESH_ANIMATIONS.WALK:
        case MESH_ANIMATIONS.RUN:
          mixer.addEventListener('finished', onAnimationFinished)

          actions[selected_animation]
            .reset()
            .setLoop(THREE.LoopOnce)
            .fadeIn(0.5)
            .play()
      }
    }
  }

  useEffect(() => {
    // MODEL ANIMATION SUBSCRIPTION (ZUSTAND) (GLTF ANIMATION)
    const subscribe_model_animation = useStatePlayer.subscribe(
      // SELECTOR
      state => state.animation,

      // CALLBACK
      (animation, prev) => {
        actions[prev]?.fadeOut(0.5)
        // mixer.stopAllAction()
        handleAnimation(animation)
        prev = animation
      }
    )

    // PLAYER ANIMATION SUBSCRIPTION (ZUSTAND) (ANIME.JS ANIMATION)
    const subscribe_player_animation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.player_animation_state,

      // CALLBACK
      animation_state => {
        if (animation_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
          animation_player.current = ANIMATIONS.player.show({
            target_player: ref_player,
            delay: useStateAnimation.getState().player_animation_delay
          })

          animation_player.current.complete = () => setPlayerAnimationState(ANIMATION_STATE.VISIBLE)
        }
        else if (animation_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
          animation_player.current = ANIMATIONS.player.hide({
            target_player: ref_player,
            delay: useStateAnimation.getState().player_animation_delay
          })

          animation_player.current.complete = () => setPlayerAnimationState(ANIMATION_STATE.HIDDEN)
        }
        else if (animation_state === ANIMATION_STATE.VISIBLE) {
          setAnimation(MESH_ANIMATIONS.IDLE)
        }
      }
    )

    // DICE ROLL SUBSCRIPTION (ZUSTAND)
    const subscribe_combat_dice_rolls = useStateDice.subscribe(
      // SELECTOR
      state => state.dice_state_combined,

      // CALLBACK
      dice_state_combined => {
        if (dice_state_combined === DICE_STATE.ROLL_COMPLETE) {
          const
            dice_roll_player = useStateDice.getState().dice_value_player,
            dice_roll_enemy = useStateDice.getState().dice_value_enemy

          if (dice_roll_player > dice_roll_enemy) {
            setAnimation(MESH_ANIMATIONS.SLASH)
          }
          else if (dice_roll_player < dice_roll_enemy) {
            setAnimation(MESH_ANIMATIONS.BLOCK)
          }
          else {
            setAnimation(MESH_ANIMATIONS.IDLE)
          }
        }
      }
    )

    // CLEANUP
    return () => {
      subscribe_model_animation()
      subscribe_player_animation()
      subscribe_combat_dice_rolls()
    }
  }, [])

  return <>
    <RigidBody
      type='fixed'
      friction={0}
      colliders={false}
      dispose={null}
    >
      <CapsuleCollider
        args={[0.6, 0.9]}
        position={[position[0], position[1], position[2] - 0.1]}
        rotation={rotation}
      />
    </RigidBody>
    <group
      ref={ref_player}
      position={[position[0], POSITIONS.PLAYER.y.hidden, position[2] + 0.2]}
      rotation={rotation}
      scale={scale}
      visible={visible}
      dispose={null}
    >
      <primitive object={nodes._rootJoint} />
      <skinnedMesh
        castShadow={castShadow}
        geometry={nodes.Object_35.geometry}
        material={materials.knight}
        skeleton={nodes.Object_35.skeleton}
      />
    </group>
  </>
}

export { MESH_ANIMATIONS }
export default memo(Warrior)