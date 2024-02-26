import { ScreenSpace } from '@react-three/drei'

import { useStateGame } from '../../stores/useStateGame'
import TitleScreen from './TitleScreen'
import HUDScreen from './HUDScreen'

const ScreenOverlay = () => {
  const render_title_screen = useStateGame(state => state.render_title_screen)

  return <ScreenSpace depth={1}>
    {render_title_screen && <TitleScreen />}
    <HUDScreen />
  </ScreenSpace>
}

export default ScreenOverlay