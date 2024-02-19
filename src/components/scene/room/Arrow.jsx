import { memo } from 'react'
import { Image } from '@react-three/drei'

import HUDImages from '../../../common/HUDImages'
import { mouse_pointer } from '../../../common/Utils'
import { DIRECTION } from './Constants'

const DIRECTION_DATA = {
  NORTH: {
    url: HUDImages.DIRECTION_NORTH.path,
    scale: HUDImages.DIRECTION_NORTH.scale,
    position: [0, 0.2, -6],
    rotation: [-Math.PI * 0.5, 0, 0]
  },
  SOUTH: {
    url: HUDImages.DIRECTION_SOUTH.path,
    scale: HUDImages.DIRECTION_SOUTH.scale,
    position: [0, 0.2, 6],
    rotation: [-Math.PI * 0.5, 0, Math.PI]
  },
  EAST: {
    url: HUDImages.DIRECTION_EAST.path,
    scale: HUDImages.DIRECTION_EAST.scale,
    position: [6, 0.2, 0],
    rotation: [-Math.PI * 0.5, 0, -Math.PI * 0.5]
  },
  WEST: {
    url: HUDImages.DIRECTION_WEST.path,
    scale: HUDImages.DIRECTION_WEST.scale,
    position: [-6, 0.2, 0],
    rotation: [-Math.PI * 0.5, 0, Math.PI * 0.5]
  }
}

const getDirectionData = (direction) => {
  switch (direction) {
    case DIRECTION.SOUTH:
      return DIRECTION_DATA.SOUTH

    case DIRECTION.EAST:
      return DIRECTION_DATA.EAST

    case DIRECTION.WEST:
      return DIRECTION_DATA.WEST

    default:
      return DIRECTION_DATA.NORTH
  }
}

const Arrow = ({ forward_ref, direction = DIRECTION.NORTH, visible = false }) => {
  console.log('RENDER: Arrow')

  const data = getDirectionData(direction)

  return <Image
    ref={forward_ref}
    transparent
    toneMapped={false}
    url={data.url}
    scale={data.scale}
    position={data.position}
    rotation={data.rotation}
    visible={visible}
    opacity={0}
    dispose={null}

    onPointerOver={mouse_pointer.over}
    onPointerOut={mouse_pointer.out}
  />
}

export default memo(Arrow)