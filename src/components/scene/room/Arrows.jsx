import { memo } from "react"
import { Image } from "@react-three/drei"

import HUDImages from "../../../common/HUDImages"
import { mouse_pointer } from "../../../common/Utils"

const Arrows = () => {
  console.log('RENDER: Arrows')

  return <group
    dispose={null}
  >
    <Image
      url={HUDImages.DIRECTION_NORTH.path}
      scale={HUDImages.DIRECTION_NORTH.scale}
      transparent
      toneMapped={false}
      position={[0, 0.2, -6]}
      rotation={[-Math.PI * 0.5, 0, 0]}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />
    <Image
      url={HUDImages.DIRECTION_SOUTH.path}
      scale={HUDImages.DIRECTION_SOUTH.scale}
      transparent
      toneMapped={false}
      position={[0, 0.2, 6]}
      rotation={[-Math.PI * 0.5, 0, Math.PI]}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />
    <Image
      url={HUDImages.DIRECTION_EAST.path}
      scale={HUDImages.DIRECTION_EAST.scale}
      transparent
      toneMapped={false}
      position={[6, 0.2, 0]}
      rotation={[-Math.PI * 0.5, 0, -Math.PI * 0.5]}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />
    <Image
      url={HUDImages.DIRECTION_WEST.path}
      scale={HUDImages.DIRECTION_WEST.scale}
      transparent
      toneMapped={false}
      position={[-6, 0.2, 0]}
      rotation={[-Math.PI * 0.5, 0, Math.PI * 0.5]}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />
  </group>
}

export default memo(Arrows)