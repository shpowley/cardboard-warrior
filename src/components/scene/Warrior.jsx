import { memo, useEffect } from 'react'
import * as THREE from 'three'
import { useAnimations, useGLTF } from '@react-three/drei'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'

import { LEVA_SORT_ORDER } from '../../common/Constants'
import { usePlayer } from '../../stores/usePlayer'


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

const Warrior = ({ position, rotation, scale, castShadow }) => {
  console.log('RENDER: Warrior')

  const { nodes, materials, animations } = useGLTF(FILE_WARRIOR)

  // ZUSTAND PLAYER ANIMATION
  const setAnimation = usePlayer(state => state.setAnimation)

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

  // https://github.com/pmndrs/drei?tab=readme-ov-file#useanimations
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

  // NOT MEANT FOR STATE RE-RENDER.. RATHER FOR ZUSTAND ANIMATION SUBSCRIPTION CHANGES
  let prev_animation = MESH_ANIMATIONS.NONE

  useEffect(() => {

    // PLAYER ANIMATION SUBSCRIPTION (ZUSTAND)
    const subscribePlayerAnimation = usePlayer.subscribe(
      // SELECTOR
      state => state.animation,

      // CALLBACK
      animation_subscribed => {
        actions[prev_animation]?.fadeOut(0.5)
        mixer.stopAllAction()
        handleAnimation(animation_subscribed)
        prev_animation = animation_subscribed
      }
    )

    // CLEANUP
    return () => {
      subscribePlayerAnimation()
    }
  }, [])

  return <>
    <RigidBody
      type='fixed'
      colliders={false}
      dispose={null}
    >
      <CylinderCollider
        args={[1.1, 0.9]}
        position={[position[0], position[1] + 0.3, position[2]]}
        rotation={rotation}
      />
    </RigidBody>
    <group
      position={[position[0], 0, position[2] + 0.2]}
      rotation={rotation}
      scale={scale}
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