import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useAnimations, useGLTF } from '@react-three/drei'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'

import { LEVA_SORT_ORDER } from '../../common/Constants'
import { useStatePlayer } from '../../stores/useStatePlayer'
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

  let loop_count = 0

  const onSlashAnimationLoop = e => {
    loop_count++

    if (loop_count === 3) {
      mixer.removeEventListener('loop', onSlashAnimationLoop)

      actions[MESH_ANIMATIONS.SLASH].stop()

      actions[MESH_ANIMATIONS.IDLE]
        .reset()
        .setLoop(THREE.LoopRepeat)
        .fadeIn(0.5)
        .play()
    }
  }

  const handleAnimation = (selected_animation) => {
    if (selected_animation === MESH_ANIMATIONS.NONE) {
      mixer.stopAllAction()
    }
    else {
      switch (selected_animation) {
        case MESH_ANIMATIONS.IDLE:
          actions[selected_animation].setLoop(THREE.LoopRepeat)
          break

        case MESH_ANIMATIONS.BLOCK:
          actions[selected_animation].setLoop(THREE.LoopRepeat)

          // SMOOTH TRANSITION TO IDLE
          setTimeout(() => {
            actions[MESH_ANIMATIONS.IDLE]
              .reset()
              .setLoop(THREE.LoopRepeat)
              .crossFadeFrom(actions[selected_animation], 0.5)
              .play()
          }, 3000)

          break

        case MESH_ANIMATIONS.SLASH:
          actions[selected_animation].setLoop(THREE.LoopRepeat)

          loop_count = 0
          mixer.addEventListener('loop', onSlashAnimationLoop)

          break

        case MESH_ANIMATIONS.WALK:
        case MESH_ANIMATIONS.RUN:
          actions[selected_animation].setLoop(THREE.LoopOnce)
      }

      actions[selected_animation].reset().fadeIn(0.5).play()
    }
  }

  useEffect(() => {

    // MODEL ANIMATION SUBSCRIPTION (ZUSTAND) (GLTF ANIMATION)
    const subscribeModelAnimation = useStatePlayer.subscribe(
      // SELECTOR
      state => state.animation,

      // CALLBACK
      (animation, prev) => {
        actions[prev]?.fadeOut(0.5)
        mixer.stopAllAction()
        handleAnimation(animation)
        prev = animation
      }
    )

    // PLAYER ANIMATION SUBSCRIPTION (ZUSTAND) (ANIME.JS ANIMATION)
    const subscribePlayerAnimation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.player_animation_state,

      // CALLBACK
      animation_state => {
        if (animation_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
          animation_player.current = ANIMATIONS.animatePlayerShow({
            target_player: ref_player,
            delay: useStateAnimation.getState().player_animation_delay
          })

          animation_player.current.complete = () => setPlayerAnimationState(ANIMATION_STATE.VISIBLE)
        }
        else if (animation_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
          animation_player.current = ANIMATIONS.animatePlayerHide({
            target_player: ref_player,
            delay: useStateAnimation.getState().player_animation_delay
          })

          animation_player.current.complete = () => setPlayerAnimationState(ANIMATION_STATE.HIDDEN)
        }
      }
    )

    // CLEANUP
    return () => {
      subscribeModelAnimation()
      subscribePlayerAnimation()
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