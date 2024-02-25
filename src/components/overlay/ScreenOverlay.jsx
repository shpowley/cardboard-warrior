import { ScreenSpace } from '@react-three/drei'

import TitleScreen from './TitleScreen'
import HUDScreen from './HUDScreen'

const ScreenOverlay = () => {
  return <ScreenSpace depth={1}>
    <TitleScreen />
    <HUDScreen />
  </ScreenSpace>
}

export default ScreenOverlay