import { memo, useEffect } from "react"
import { Text } from "@react-three/drei"
import { FILE_FONT_BEBAS_NEUE } from "../../common/Constants"
import { useGame } from "../../stores/useGame"

const GameLog = ({ forward_ref, aspect_ratio = 1 }) => {
  console.log('RENDER: GameLog')

  useEffect(() => {
    forward_ref.current.visible = true

    // LOG DATA SUBSCRIPTION (ZUSTAND)
    const subscribeLog = useGame.subscribe(
      // SELECTOR
      state => state.log,

      // CALLBACK
      log_subscribed => {
        if (log_subscribed) {
          forward_ref.current.text = log_subscribed
        }
      }
    )

    // CLEANUP
    return () => {
      subscribeLog()
    }
  }, [])

  return <Text
    ref={forward_ref}
    font={FILE_FONT_BEBAS_NEUE}
    position={[-0.4 * aspect_ratio, -0.23, 0]}
    scale={0.025}
    anchorX='left'
    anchorY='bottom'
    text='...'
    visible={false}
    dispose={null}
  >
    <meshBasicMaterial
      toneMapped={false}
      color='#0b4498'
      opacity={0}
    />
  </Text>
}

export default memo(GameLog)