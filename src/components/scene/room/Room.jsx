import { POSITIONING_ADJUST, ROOM_COLLIDER, ROOM_EXTENTS, THICKNESS_EXTENT } from "./Constants"
import Floor from "./Floor"
import Wall from "./Wall"

const Room = (props) => {
  return <>
    <Floor />

    {/* NORTH WALL */}
    <Wall
      position={[0, ROOM_COLLIDER.wall_position_y, -POSITIONING_ADJUST]}
    />

    {/* SOUTH WALL */}
    <Wall
      position={[0, ROOM_COLLIDER.wall_position_y, POSITIONING_ADJUST]}
      rotation={[0, Math.PI, 0]}
    />

    {/* EAST WALL */}
    <Wall
      position={[POSITIONING_ADJUST, ROOM_COLLIDER.wall_position_y, 0]}
      rotation={[0, -Math.PI * 0.5, 0]}
    />

    {/* WEST WALL */}
    <Wall
      position={[-POSITIONING_ADJUST, ROOM_COLLIDER.wall_position_y, 0]}
      rotation={[0, Math.PI * 0.5, 0]}
    />
  </>
}

export default Room