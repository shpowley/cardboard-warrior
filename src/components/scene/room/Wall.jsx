import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

import { ROOM_COLLIDER, ROOM_EXTENTS, THICKNESS_EXTENT } from './Constants'
import { POSITIONS } from '../../../common/Positions'
import Door from './Door'
import Arrow from './Arrow'

const geometry_wall = new THREE.PlaneGeometry(
  ROOM_EXTENTS.width * 2,
  ROOM_EXTENTS.visible_height * 2
)

const material_wall = new THREE.MeshStandardMaterial({ color: '#dbd7d2' })

const Wall = ({ forward_ref, position, rotation, visible = false, direction }) => {
  return <>
    <RigidBody
      type='fixed'
      restitution={0.5}
      friction={0}
      colliders={false}
      dispose={null}
    >
      <CuboidCollider
        args={ROOM_COLLIDER.wall_extents}
        position={position}
        rotation={rotation}
      />
    </RigidBody>
    <group
      ref={forward_ref.wall}
      position={[position[0], POSITIONS.WALLS.y.hidden, position[2]]}
      rotation={rotation}
      visible={visible}
      dispose={null}
    >
      <Door
        forward_ref={forward_ref.door}
        position={[0, -ROOM_EXTENTS.height, 0.35]}
        scale={1.5}
      />
      <mesh
        receiveShadow
        position={[0, -(ROOM_EXTENTS.height - ROOM_EXTENTS.visible_height), THICKNESS_EXTENT]}
        geometry={geometry_wall}
        material={material_wall}
      />
    </group>
    <Arrow
      forward_ref={forward_ref.arrow}
      direction={direction}
    />
  </>
}

export default Wall