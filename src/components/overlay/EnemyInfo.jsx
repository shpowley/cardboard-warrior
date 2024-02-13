import { memo } from 'react'
import { Image, Text } from '@react-three/drei'
import { useControls } from 'leva'

import { FILE_FONT_BEBAS_NEUE, LEVA_SORT_ORDER } from '../../common/Constants'
import HUDImages from '../../common/HUDImages'

const EnemyInfo = ({ forward_ref, aspect_ratio = 1, material_text }) => {

  // LEVA DEBUG ENEMY STATE
  const controls_enemy = useControls(
    'enemy info',
    {
      position_x: {
        label: 'position-x',
        value: 0.407,
        min: -1,
        max: 1,
        step: 0.01
      }
    },

    { collapsed: true, order: LEVA_SORT_ORDER.ENEMY }
  )

  return <group
    position={[controls_enemy.position_x * aspect_ratio, 0.39, 0]}
    scale={0.021}
    anchorX='right'
    anchorY='top'
    visible={false}
    dispose={null}
  >
    {/* MONSTER NAME */}
    <Text
      font={FILE_FONT_BEBAS_NEUE}
      material={material_text}
      anchorX='right'
      text='ENEMY: -'
    />

    {/* MONSTER HEALTH */}
    <group
      position={[-4.5, -1.4, 0]}
      anchorX='right'
    >
      <Image
        url={HUDImages.HEART.path}
        scale={HUDImages.HEART.scale}
        toneMapped={false}
        transparent
      />
      <Text
        font={FILE_FONT_BEBAS_NEUE}
        material={material_text}
        position={[0.7, -0.01, 0]}
        anchorX='left'
        text='-'
      />
    </group>

    {/* MONSTER ATTACK */}
    <group
      position={[-4.5, -2.8, 0]}
      anchorX='right'
    >
      <Image
        url={HUDImages.SWORD.path}
        scale={HUDImages.SWORD.scale}
        toneMapped={false}
        transparent
      />
      <Text
        font={FILE_FONT_BEBAS_NEUE}
        material={material_text}
        position={[0.7, -0.01, 0]}
        anchorX='left'
        text='-'
      />
    </group>
  </group>
}

export default memo(EnemyInfo)