import { Suspense, useEffect } from "react"
import { Physics } from '@react-three/rapier'
import { useControls } from "leva"

import { GAME_PHASE, useGame } from "../../stores/useGame"
import { LEVA_SORT_ORDER } from "../../common/Constants"
import Room from "./room/Room"

/**
 * RAPIER PHYSICS: https://github.com/pmndrs/react-three-rapier
 */
const SceneContent = (props) => {
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
  const show_scene = [
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

  return show_scene ?
    <Suspense fallback={null}>
      <Physics
        gravity={[0, -9.81, 0]}
        debug={controls_physics.debug}
      >
        <Room />
      </Physics>
    </Suspense>
    :
    null
}

export default SceneContent

// GAME_INIT: 0,
// TITLE_SHOWING: 1,
// TITLE_VISIBLE: 2,
// TITLE_HIDING: 3,
// GAME_START: 4,
// HUD_SHOWING: 5,
// ROOM_SHOWING: 6,
// ROOM_HIDING: 7,
// PLAYER_MOVEMENT: 8,
// PLAYER_COMBAT: 9,
// GAME_OVER: 10