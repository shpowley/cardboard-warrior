import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

import { ROOM_COLLIDER } from './Constants'
import { memo } from 'react'

const geometry_floor = new THREE.PlaneGeometry(
  ROOM_COLLIDER.floor_extents[0] * 2,
  ROOM_COLLIDER.floor_extents[2] * 2
)

const material_floor = new THREE.MeshStandardMaterial({ color: '#93836c' })

const Floor = () => {
  console.log('RENDER: Floor')

  return <>
    <RigidBody
      type='fixed'
      restitution={0.5}
      friction={0.3}
      colliders={false}
      dispose={null}
    >
      <CuboidCollider
        args={ROOM_COLLIDER.floor_extents}
        position={[0, ROOM_COLLIDER.floor_position_y, 0]}
        restitution={0.4}
        friction={0.3}
      />
    </RigidBody>
    <mesh
      receiveShadow
      rotation={[-Math.PI * 0.5, 0, 0]}
      geometry={geometry_floor}
      material={material_floor}
      dispose={null}
    />
  </>
}

export default memo(Floor)