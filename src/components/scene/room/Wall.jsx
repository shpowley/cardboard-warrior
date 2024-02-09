import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

import { ROOM_COLLIDER, THICKNESS_EXTENT } from './Constants'

const geometry_wall = new THREE.PlaneGeometry(
  ROOM_COLLIDER.wall_extents[0] * 2,
  ROOM_COLLIDER.wall_extents[1]
)

const material_wall = new THREE.MeshStandardMaterial({ color: '#dbd7d2' })

const Wall = ({ position, rotation, visible = true }) => {
  return <>
    <RigidBody
      type='fixed'
      restitution={0.5}
      friction={0}
      colliders={false}
    >
      <CuboidCollider
        args={ROOM_COLLIDER.wall_extents}
        position={position}
        rotation={rotation}
      />
    </RigidBody>
    <group
      position={position}
      rotation={rotation}
      visible={visible}
    >
      <mesh
        receiveShadow
        position={[0, -ROOM_COLLIDER.wall_extents[1] * 0.5, THICKNESS_EXTENT]}
        geometry={geometry_wall}
        material={material_wall}
      />
    </group>
  </>
}

export default Wall