import { useGLTF } from '@react-three/drei'
import { memo } from 'react'

const FILE_DOOR = './models/door-compressed.glb'

useGLTF.preload(FILE_DOOR)

/** HOW TO CREATE MESH INSTANCES?
 * - THIS ISN'T VERY TAXING ON PERFORMANCE, BUT EXPLORE THE USE OF INSTANCING FOR
 *   OTHER SCENARIOES (E.G. COIN DROP)
 */
const Door = ({ forward_ref, position, scale }) => {
  const { nodes, materials } = useGLTF(FILE_DOOR)

  return (
    <mesh
      ref={forward_ref}
      position={position}
      scale={scale}
      geometry={nodes.door.geometry}
      material={materials.material_2}
    />
  )
}

export default memo(Door)