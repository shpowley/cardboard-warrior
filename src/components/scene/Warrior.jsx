import { useAnimations, useGLTF } from '@react-three/drei'
import { CylinderCollider, RigidBody } from '@react-three/rapier'


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
  const { nodes, materials, animations } = useGLTF(FILE_WARRIOR)

  // https://github.com/pmndrs/drei?tab=readme-ov-file#useanimations
  const { actions } = useAnimations(animations, nodes._rootJoint)

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
export default Warrior