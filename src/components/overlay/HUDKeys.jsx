import { Image } from "@react-three/drei"

import HUDImages from "../../common/HUDImages"
import { mouse_pointer } from "../../common/Utils"
import { POSITIONS } from "../../common/Positions"
import { memo } from "react"

const HUDKeys = ({ forward_ref }) => {
  console.log('RENDER: HUDKeys')

  return <group
    ref={forward_ref}
    position={[POSITIONS.KEYS.x, POSITIONS.KEYS.y.hidden, 0]}
    scale={0.04}
    dispose={null}
  >
    {/* NORTH KEY */}
    <Image
      url={HUDImages.KEY_NORTH.path}
      transparent
      toneMapped={false}
      position={[0, 1.2, 0]}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />

    {/* SOUTH KEY */}
    <Image
      url={HUDImages.KEY_SOUTH.path}
      transparent
      toneMapped={false}
      position={[0, -1.2, 0]}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />

    {/* EAST KEY */}
    <Image
      url={HUDImages.KEY_EAST.path}
      transparent
      toneMapped={false}
      position={[1.2, 0, 0]}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />

    {/* WEST KEY */}
    <Image
      url={HUDImages.KEY_WEST.path}
      transparent
      toneMapped={false}
      position={[-1.2, 0, 0]}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />

    {/* ROLL KEY */}
    <Image
      url={HUDImages.KEY_ROLL.path}
      transparent
      toneMapped={false}
      position={[3.5, -1.2, 0]}
      scale={HUDImages.KEY_ROLL.scale}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />

    {/* POTION KEY */}
    <Image
      url={HUDImages.KEY_POTION.path}
      transparent
      toneMapped={false}
      position={[2.48, 0, 0]}
      scale={HUDImages.KEY_POTION.scale}

      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />
  </group>
}

export default memo(HUDKeys)