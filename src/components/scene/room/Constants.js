const THICKNESS_EXTENT = 0.3

const ROOM_EXTENTS = {
  width: 8,
  height: 4
}

const POSITIONING_ADJUST = ROOM_EXTENTS.width + THICKNESS_EXTENT

const ROOM_COLLIDER = {
  wall_extents: [ROOM_EXTENTS.width, ROOM_EXTENTS.height, THICKNESS_EXTENT],
  wall_position_y: ROOM_EXTENTS.height,

  floor_extents: [ROOM_EXTENTS.width, THICKNESS_EXTENT, ROOM_EXTENTS.width],
  floor_position_y: -THICKNESS_EXTENT,

  top_extents: [ROOM_EXTENTS.width, THICKNESS_EXTENT, ROOM_EXTENTS.width],
  top_position_y: ROOM_EXTENTS.height * 2 + THICKNESS_EXTENT,
}

export {
  THICKNESS_EXTENT,
  POSITIONING_ADJUST,
  ROOM_COLLIDER,
  ROOM_EXTENTS
}