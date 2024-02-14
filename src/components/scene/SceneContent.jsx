import { Suspense, useEffect } from 'react'
import { Physics } from '@react-three/rapier'
import { button, useControls } from 'leva'

import { GAME_PHASE, useStateGame } from '../../stores/useStateGame'
import { LEVA_SORT_ORDER } from '../../common/Constants'
import Room from './room/Room'
import Sign from './Sign'
import Warrior from './Warrior'
import Dice from './dice/Dice'
import { ANIMATION_STATE, useStateAnimation } from '../../stores/useStateAnimation'

/**
 * RAPIER PHYSICS: https://github.com/pmndrs/react-three-rapier
 */
const SceneContent = () => {
  console.log('RENDER: SceneContent')

  // ZUSTAND STATES
  const
    phase = useStateGame(state => state.phase),
    setRoomAnimationState = useStateAnimation(state => state.setRoomAnimationState),
    setMonsterSignAnimationState = useStateAnimation(state => state.setMonsterSignAnimationState),
    setPlayerAnimationState = useStateAnimation(state => state.setPlayerAnimationState),
    setDiceAnimationState = useStateAnimation(state => state.setDiceAnimationState)

  // LEVA DEBUG CONTROLS
  const controls_physics = useControls(
    'physics',

    { debug: false },

    {
      collapsed: true,
      order: LEVA_SORT_ORDER.PHYSICS
    }
  )

  useControls(
    'construction animations',

    {
      'room': button(() => {
        const room_state = useStateAnimation.getState().room_animation_state

        if (room_state === ANIMATION_STATE.HIDDEN) {
          setRoomAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
        }
        else if (room_state === ANIMATION_STATE.VISIBLE) {
          setRoomAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE)
        }
      }),

      'box warrior': button(() => console.log('warrior animation')),
      'monster sign': button(() => console.log('sign animation')),
      'dice': button(() => console.log('dice animation'))
    },

    {
      collapsed: true,
      order: LEVA_SORT_ORDER.CONSTRUCTION_ANIMATIONS
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
    const subscribeGamePhase = useStateGame.subscribe(
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