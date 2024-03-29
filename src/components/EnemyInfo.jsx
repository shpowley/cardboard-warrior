import { memo } from "react"
import { FILE_FONT_BEBAS_NEUE, GAME_PHASE } from "../common/Constants"
import { Image, Text } from "@react-three/drei"
import HUDImages from "../common/HUDImages"

const EnemyInfo = memo(({ game_phase = GAME_PHASE.START, aspect_ratio = 1, data, inner_refs }) => {
  const
    controls_visible = game_phase === GAME_PHASE.COMBAT,
    text_color = 'black'

  return <group
    scale={0.021}
    position={[0.407 * aspect_ratio, 0.39, 0]}
    visible={controls_visible}
    anchorX={'right'}
    anchorY={'top'}
  >
    <Text
      ref={inner_refs?.name}
      font={FILE_FONT_BEBAS_NEUE}
      color={text_color}
      anchorX={'right'}
    >
      <meshBasicMaterial toneMapped={false} />
      ENEMY: {data?.label ?? 'NONE'}
    </Text>

    {/* HEALTH POINTS */}
    <group
      position={[-4.5, -1.4, 0]}
      anchorX={'right'}
    >
      <Image
        url={HUDImages.HEART.path}
        transparent
        toneMapped={false}
        scale={HUDImages.HEART.scale}
      />
      <Text
        ref={inner_refs?.health}
        font={FILE_FONT_BEBAS_NEUE}
        color={text_color}
        position={[0.7, -0.1, 0]}
        anchorX={'left'}
      >
        <meshBasicMaterial toneMapped={false} />
        {data?.health ?? 0} HP
      </Text>
    </group>

    {/* ATTACK */}
    <group
      position={[-4.5, -2.8, 0]}
      anchorX={'right'}
    >
      <Image
        url={HUDImages.SWORD.path}
        transparent
        toneMapped={false}
        scale={HUDImages.SWORD.scale}
      />
      <Text
        font={FILE_FONT_BEBAS_NEUE}
        color={text_color}
        position={[0.7, -0.1, 0]}
        anchorX={'left'}
      >
        <meshBasicMaterial toneMapped={false} />
        {data?.attack ?? 0} ATTACK
      </Text>
    </group>
  </group>
})

export default EnemyInfo