import { memo, useEffect } from 'react'
import { Text } from '@react-three/drei'

import { FILES } from '../../common/Constants'
import { useStateGame } from '../../stores/useStateGame'

const GameLog = ({ forward_ref, aspect_ratio = 1 }) => {
  useEffect(() => {
    forward_ref.current.visible = true

    // LOG DATA SUBSCRIPTION (ZUSTAND)
    const subscribe_log = useStateGame.subscribe(
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
      subscribe_log()
    }
  }, [])

  return <Text
    ref={forward_ref}
    font={FILES.FONT_BEBAS_NEUE}
    position={[-0.4 * aspect_ratio, -0.31, 0]}
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