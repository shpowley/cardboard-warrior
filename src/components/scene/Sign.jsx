import { memo } from 'react'
import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'

import { MONSTERS} from '../../common/Monsters'
import { LEVA_SORT_ORDER } from '../../common/Constants'

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

const SignMaterial = ({ material, texture_url, x, y, scale }) => {
  let texture, canvas_texture

  if (texture_url) {
    texture = useTexture(texture_url)
    canvas_texture = getCanvasTexture(texture, x, y, scale)
  }

  return <meshStandardMaterial
    map={canvas_texture ? canvas_texture : material.map}
    roughness={material.roughness}
    side={material.side}
  />
}

const Sign = ({ castShadow = false, position, rotation, scale }) => {
  console.log('RENDER: Sign')

  const { nodes, materials } = useGLTF(FILE_SIGN)

  const controls_monster = useControls(
    'monster sign',

    {
      image: {
        value: 'NONE',
        options: MONSTERS
      }
    },

    {
      collapsed: true,
      order: LEVA_SORT_ORDER.MONSTER
    }
  )

  return <>
    <RigidBody
      type='fixed'
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
      position={position}
      rotation={rotation}
      scale={scale}
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
          texture_url={controls_monster.image?.path}
          x={controls_monster.image?.x}
          y={controls_monster.image?.y}
          scale={controls_monster.image?.scale}
        />
      </mesh>

    </group>
  </>
}

export default memo(Sign)