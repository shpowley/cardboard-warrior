import { useGLTF } from "@react-three/drei"
import { memo } from "react"

const FILE_DOOR = './models/door-compressed.glb'

useGLTF.preload(FILE_DOOR)

/** HOW TO CREATE MESH INSTANCES?
 * - THIS ISN'T VERY TAXING ON PERFORMANCE, BUT EXPLORE THE USE OF INSTANCING FOR
 *   OTHER SCENARIOES (E.G. COIN DROP)
 */
const Door = (props) => {
  const { nodes, materials } = useGLTF(FILE_DOOR)

  return (
    <group
      {...props}
      ref={props.inner_ref}
    >
      <mesh
        geometry={nodes.door.geometry}
        material={materials.material_2}
      />
    </group>
  )
}

export default memo(Door)