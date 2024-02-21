import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'

import { MONSTERS } from '../../common/Monsters'
import { LEVA_SORT_ORDER } from '../../common/Constants'
import { useStateEnemy } from '../../stores/useStateEnemy'
import { POSITIONS } from '../../common/Positions'
import { ANIMATION_STATE, useStateAnimation } from '../../stores/useStateAnimation'
import ANIMATIONS from '../../common/Animation'
import { useStatePlayer } from '../../stores/useStatePlayer'

const EXTENT_HEIGHT = 1.85
const FILE_SIGN = './models/sign-compressed.glb'

useGLTF.preload(FILE_SIGN)

const getCanvasTexture = (texture, x, y, scale) => {
  const larger_dimension = Math.max(texture.image.width, texture.image.height)
  const ctx = document.createElement('canvas').getContext('2d')

  ctx.canvas.width = larger_dimension
  ctx.canvas.height = larger_dimension
  ctx.scale(scale, scale)

  ctx.drawImage(
    texture.image,
    x,
    y,
    texture.image.width,
    texture.image.height
  )

  return new THREE.CanvasTexture(ctx.canvas)
}

/**
 * texture_url, x, y, scale PROPS ARE ONLY FOR THE INITIAL VALUES
 * ZUSTAND EVENT SUBSCRIPTIONS WILL OVERRIDE THESE VALUES AS NEEDED
 */
const SignMaterial = ({ material, texture_url, x, y, scale }) => {
  console.log('RENDER: SignMaterial')

  const ref_material = useRef()

  let canvas_texture

  if (texture_url) {
    const texture = useTexture(texture_url)
    canvas_texture = getCanvasTexture(texture, x, y, scale)
  }

  useEffect(() => {

    // ENEMY IMAGE SUBSCRIPTION (ZUSTAND)
    const subscribeEnemyImage = useStateEnemy.subscribe(
      // SELECTOR
      state => state.image_data,

      // CALLBACK
      image_data => {
        if (!ref_material.current) {
          return
        }

        if (image_data?.path) {
          const loader = new THREE.TextureLoader()
          loader.load(
            image_data.path,

            texture => ref_material.current.map = getCanvasTexture(texture, image_data.x, image_data.y, image_data.scale)
          )
        }
        else {
          ref_material.current.map = material.map
        }
      }
    )

    // CLEAN UP
    return () => {
      subscribeEnemyImage()
    }
  }, [])

  return <meshStandardMaterial
    ref={ref_material}
    map={canvas_texture ? canvas_texture : material.map}
    roughness={material.roughness}
    side={material.side}
  />
}

const Sign = ({ castShadow = false, position, rotation, scale, visible = false }) => {
  console.log('RENDER: Sign')

  const { nodes, materials } = useGLTF(FILE_SIGN)

  const ref_sign = useRef()

  // ANIMATIONS (anime.js)
  const animation_sign = useRef()

  // ZUSTAND MONSTER STATE
  const
    setImageData = useStateEnemy(state => state.setImageData),
    setMonsterSignAnimationState = useStateAnimation(state => state.setMonsterSignAnimationState)

  useControls(
    'monster sign',

    {
      image: {
        value: 'NONE',
        options: MONSTERS,

        onChange: value => {
          setImageData(value)
        }
      }
    },

    {
      collapsed: true,
      order: LEVA_SORT_ORDER.MONSTER
    }
  )

  useEffect(() => {
    // SIGN ANIMATION SUBSCRIPTION (ZUSTAND)
    const subscribeSignAnimation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.monster_sign_animation_state,

      // CALLBACK
      animation_state => {
        if (animation_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
          const monster = useStatePlayer.getState().room?.monster

          if (!monster) {
            console.error('ERROR: Sign.jsx -- no monster data found')
            return
          }

          setImageData(monster)

          animation_sign.current = ANIMATIONS.animateSignShow({
            target_sign: ref_sign,
            delay: useStateAnimation.getState().monster_sign_animation_delay
          })

          animation_sign.current.complete = () => {
            setMonsterSignAnimationState(ANIMATION_STATE.VISIBLE)
          }
        }
        else if (animation_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
          animation_sign.current = ANIMATIONS.animateSignHide({
            target_sign: ref_sign,
            delay: useStateAnimation.getState().monster_sign_animation_delay
          })

          animation_sign.current.complete = () => {
            setMonsterSignAnimationState(ANIMATION_STATE.HIDDEN)
          }
        }
      }
    )

    // CLEAN UP
    return () => {
      subscribeSignAnimation()
    }
  }, [])

  return <>
    <RigidBody
      type='fixed'
      friction={0}
      colliders={false}
      dispose={null}
    >
      <CuboidCollider
        args={[1.3, EXTENT_HEIGHT, 0.26]}
        position={[position[0], position[1] + EXTENT_HEIGHT, position[2] + 0.1]}
        rotation={rotation}
      />
    </RigidBody>
    <group
      ref={ref_sign}
      position={[position[0], POSITIONS.MONSTER_SIGN.y.hidden, position[2]]}
      rotation={rotation}
      scale={scale}
      visible={visible}
      dispose={null}
    >
      <mesh
        castShadow={castShadow}
        geometry={nodes.post_1.geometry}
      >
        <meshStandardMaterial
          map={materials['sign-post'].map}
          roughness={materials['sign-post'].roughness}
          side={materials['sign-post'].side}
          flatShading={true}
        />
      </mesh>
      <mesh
        castShadow={castShadow}
        geometry={nodes.post_2.geometry}
      >
        <SignMaterial
          material={materials['paper-sign']}
        />
      </mesh>

    </group>
  </>
}

export default memo(Sign)