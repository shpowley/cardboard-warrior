import { useGLTF } from "@react-three/drei"

const FILE_DOOR = './models/door-compressed.glb'

useGLTF.preload(FILE_DOOR)

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

export default Door