import { memo } from "react"
import { CuboidCollider, RigidBody } from "@react-three/rapier"

import { ROOM_COLLIDER } from "./Constants"

const Ceiling = () => {
  return <RigidBody
    type='fixed'
    restitution={0.5}
    friction={0}
    colliders={false}
  >
    <CuboidCollider
      args={ROOM_COLLIDER.top_extents}
      position={[0, ROOM_COLLIDER.top_position_y, 0]}
    />
  </RigidBody>
}

export default memo(Ceiling)