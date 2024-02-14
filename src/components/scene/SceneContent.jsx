import { Suspense, useEffect } from 'react'
import { Physics } from '@react-three/rapier'
import { useControls } from 'leva'

import { GAME_PHASE, useGame } from '../../stores/useGame'
import { LEVA_SORT_ORDER } from '../../common/Constants'
import Room from './room/Room'
import Sign from './Sign'
import Warrior from './Warrior'
import Dice from './dice/Dice'

/**
 * RAPIER PHYSICS: https://github.com/pmndrs/react-three-rapier
 */
const SceneContent = () => {
  console.log('RENDER: SceneContent')

  // ZUSTAND GAME STATE
  const phase = useGame(state => state.phase)

  const controls_physics = useControls(
    'physics',

    { debug: false },

    {
      collapsed: true,
      order: LEVA_SORT_ORDER.PHYSICS
    }
  )

  // DETERMINE COMPONENTS TO RENDER
  const render_scene = [
    GAME_PHASE.HUD_SHOWING,
    GAME_PHASE.ROOM_SHOWING,
    GAME_PHASE.ROOM_HIDING,
    GAME_PHASE.PLAYER_MOVEMENT,
    GAME_PHASE.PLAYER_COMBAT
  ].includes(phase)

  useEffect(() => {

    // GAME PHASE SUBSCRIPTION (ZUSTAND)
    const subscribeGamePhase = useGame.subscribe(
      // SELECTOR
      state => state.phase,

      // CALLBACK
      phase_subscribed => {
        if (phase_subscribed === GAME_PHASE.ROOM_SHOWING) {
          console.log('useEffect > SceneContent: GAME_PHASE.ROOM_SHOWING')
        }
      }
    )

    // CLEANUP
    return () => {
      subscribeGamePhase()
    }
  }, [])

  return render_scene ?
    <Suspense fallback={null}>
      <Physics
        gravity={[0, -9.81, 0]}
        debug={controls_physics.debug}
      >
        <Room />
        <Warrior
          castShadow
          position={[1.5, 0.8, 1.5]}
          rotation={[0, -Math.PI * 0.75, 0]}
          scale={1.3}
        />
        <Sign
          castShadow
          position={[-1, 0, -1]}
          rotation={[0, Math.PI * 0.25, 0]}
          scale={2}
        />
        <Dice />
      </Physics>
    </Suspense>
    :
    null
}

export default SceneContent