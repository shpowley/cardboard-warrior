import * as THREE from 'three'
import { Text } from '@react-three/drei'

import { FILES } from '../../common/Constants'
import { memo, useEffect, useRef } from 'react'
import { useStateGame } from '../../stores/useStateGame'
import { useStatePlayer } from '../../stores/useStatePlayer'

const CANVAS = {
  size: {
    w: 256,
    h: 256
  },

  start: {
    x: 13,
    y: 13
  },

  room: {
    w: 50,
    h: 50
  },

  player: {
    w: 30,
    h: 30
  },

  spacing: 10
}

const CTX = document.createElement('canvas').getContext('2d')
CTX.canvas.width = CANVAS.size.w
CTX.canvas.height = CANVAS.size.h

const drawMap = (rooms, current_room) => {
  // CLEAR CANVAS
  CTX.fillStyle = 'white'
  CTX.fillRect(0, 0, CANVAS.size.w, CANVAS.size.h)

  // DRAW THE VISITED ROOMS
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i]

    if (room.is_room && room.visited) {
      const
        room_x = CANVAS.start.x + (i % 4) * (CANVAS.room.w + CANVAS.spacing),
        room_y = CANVAS.start.y + Math.floor(i / 4) * (CANVAS.room.h + CANVAS.spacing)

      CTX.fillStyle = '#5481d6'
      CTX.fillRect(room_x, room_y, CANVAS.room.w, CANVAS.room.h)

      // DRAW THE PLAYER ON THE MINI-MAP
      if (current_room && current_room.index === i) {
        CTX.fillStyle = '#f02626'
        CTX.fillRect(
          room_x + (CANVAS.room.w - CANVAS.player.w) / 2,
          room_y + (CANVAS.room.h - CANVAS.player.h) / 2,
          CANVAS.player.w,
          CANVAS.player.h
        )
      }
    }
  }
}

const MiniMap = ({ forward_ref, aspect_ratio = 1, material_text }) => {
  console.log('RENDER: MiniMap')

  const ref_minimap = {
    floor: useRef(),
    map_material: useRef()
  }

  useEffect(() => {

    // INITIAL VISIBILITY
    forward_ref.current.traverse(child => {
      if (child.isMesh) {
        child.material.opacity = 0
      }
    })

    forward_ref.current.visible = true

    // STATE DATA SUBSCRIPTION (ZUSTAND)
    const subscribeLevel = useStateGame.subscribe(
      // SELECTOR
      state => state.level,

      // CALLBACK
      level_data => {
        console.log('useEffect > MiniMap > subscribeLevel', level_data)

        if (level_data) {
          ref_minimap.floor.current.text = `FLOOR: ${level_data.floor_number}`
        }
      }
    )

    const subscribeRoom = useStatePlayer.subscribe(
      // SELECTOR
      state => state.room,

      // CALLBACK
      active_room => {
        console.log('useEffect > MiniMap > subscribeRoom', active_room)

        active_room
        const level_data = useStateGame.getState().level

        if (active_room && level_data) {
          drawMap(level_data.rooms, active_room)
          ref_minimap.map_material.current.map = new THREE.CanvasTexture(CTX.canvas)
          ref_minimap.map_material.current.needsUpdate = true
        }
      }
    )

    // CLEANUP
    return () => {
      subscribeLevel()
      subscribeRoom()
    }
  }, [])

  return <group
    ref={forward_ref}
    position={[0.405 * aspect_ratio, 0.39, 0]}
    scale={0.021}
    anchorX='right'
    anchorY='top'
    opacity={0}
    visible={false}
    dispose={null}
  >
    {/* FLOOR NUMBER */}
    <Text
      ref={ref_minimap.floor}
      font={FILES.FONT_BEBAS_NEUE}
      material={material_text}
      anchorX='right'
      text='FLOOR: -'
    />

    {/* MINI-MAP */}
    <mesh position={[-2, -2.8, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial
        ref={ref_minimap.map_material}
        color='white'
        toneMapped={false}
        transparent
      />
    </mesh>
  </group>
}

export default memo(MiniMap)