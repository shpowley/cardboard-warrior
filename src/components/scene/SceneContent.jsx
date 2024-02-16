import { Suspense, useEffect } from 'react'
import { Physics } from '@react-three/rapier'
import { button, useControls } from 'leva'

import { LEVA_SORT_ORDER } from '../../common/Constants'
import { GAME_PHASE, useStateGame } from '../../stores/useStateGame'
import { ANIMATION_STATE, useStateAnimation } from '../../stores/useStateAnimation'
import Room from './room/Room'
import Sign from './Sign'
import Warrior from './Warrior'
import Dice from './dice/Dice'
import { useStatePlayer } from '../../stores/useStatePlayer'

/**
 * RAPIER PHYSICS: https://github.com/pmndrs/react-three-rapier
 */
const SceneContent = () => {
  console.log('RENDER: SceneContent')

  // ZUSTAND STATES
  const
    phase = useStateGame(state => state.phase),
    setRoomAnimationState = useStateAnimation(state => state.setRoomAnimationState),
    setWallAnimationState = useStateAnimation(state => state.setWallAnimationState),
    setMonsterSignAnimationState = useStateAnimation(state => state.setMonsterSignAnimationState),
    setPlayerAnimationState = useStateAnimation(state => state.setPlayerAnimationState),
    setDiceAnimationState = useStateAnimation(state => state.setDiceAnimationState)

  const buildRoom = () => {
    const active_room = useStatePlayer.getState().room

    const {
      room_animation_state,
      wall_animation_state,
      player_animation_state,
      monster_sign_animation_state,
      dice_animation_state
    } = useStateAnimation.getState()

    if (room_animation_state === ANIMATION_STATE.HIDDEN) {
      if (player_animation_state === ANIMATION_STATE.HIDDEN) {
        setPlayerAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
      }

      if (wall_animation_state === ANIMATION_STATE.HIDDEN) {
        setWallAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE, 1000)
      }

      if (active_room.monster) {
        if (monster_sign_animation_state === ANIMATION_STATE.HIDDEN) {
          setMonsterSignAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE, 2500)
        }

        if (dice_animation_state === ANIMATION_STATE.HIDDEN) {
          setDiceAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE, 3000)
        }
      }

      setRoomAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
    }
  }

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
      'dungeon room': button(() => {
        const {
          room_animation_state,
          wall_animation_state,
          player_animation_state,
          monster_sign_animation_state,
          dice_animation_state
        } = useStateAnimation.getState()

        if (room_animation_state === ANIMATION_STATE.HIDDEN) {
          if (player_animation_state === ANIMATION_STATE.HIDDEN) {
            setPlayerAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
          }

          if (wall_animation_state === ANIMATION_STATE.HIDDEN) {
            setWallAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE, 1000)
          }

          if (monster_sign_animation_state === ANIMATION_STATE.HIDDEN) {
            setMonsterSignAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE, 2500)
          }

          if (dice_animation_state === ANIMATION_STATE.HIDDEN) {
            setDiceAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE, 3000)
          }

          setRoomAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
        }
        else if (room_animation_state === ANIMATION_STATE.VISIBLE) {
          if (dice_animation_state === ANIMATION_STATE.VISIBLE) {
            setDiceAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE)
          }

          if (monster_sign_animation_state === ANIMATION_STATE.VISIBLE) {
            setMonsterSignAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE, 1000)
          }

          if (wall_animation_state === ANIMATION_STATE.VISIBLE) {
            setWallAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE, 2000)
          }

          if (player_animation_state === ANIMATION_STATE.VISIBLE) {
            setPlayerAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE, 3000)
          }

          setRoomAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE)
        }
      }),

      'walls only': button(() => {
        const walls_state = useStateAnimation.getState().wall_animation_state

        if (walls_state === ANIMATION_STATE.HIDDEN) {
          setWallAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
        }
        else if (walls_state === ANIMATION_STATE.VISIBLE) {
          setWallAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE)
        }
      }),

      'box warrior': button(() => {
        const player_state = useStateAnimation.getState().player_animation_state

        if (player_state === ANIMATION_STATE.HIDDEN) {
          setPlayerAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
        }
        else if (player_state === ANIMATION_STATE.VISIBLE) {
          setPlayerAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE)
        }
      }),

      'monster sign': button(() => {
        const monster_sign_state = useStateAnimation.getState().monster_sign_animation_state

        if (monster_sign_state === ANIMATION_STATE.HIDDEN) {
          setMonsterSignAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
        }
        else if (monster_sign_state === ANIMATION_STATE.VISIBLE) {
          setMonsterSignAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE)
        }
      }),

      'dice': button(() => {
        const dice_state = useStateAnimation.getState().dice_animation_state

        if (dice_state === ANIMATION_STATE.HIDDEN) {
          setDiceAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
        }
        else if (dice_state === ANIMATION_STATE.VISIBLE) {
          setDiceAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE)
        }
      })
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

          buildRoom()
        }
      }
    )

    // SCENE ANIMATIONS SUBSCRIPTION (ZUSTAND)
    const subscribeWallAnimationState = useStateAnimation.subscribe(
      // SELECTOR
      state => state.wall_animation_state,

      // CALLBACK - NO MONSTER, THEN THIS IS THE FINAL ANIMATION
      wall_animation_state => {
        const active_room = useStatePlayer.getState().room

        if (!active_room.monster) {
          if (wall_animation_state === ANIMATION_STATE.VISIBLE) {
            setRoomAnimationState(ANIMATION_STATE.VISIBLE)
          }
          else if (wall_animation_state === ANIMATION_STATE.HIDDEN) {
            setRoomAnimationState(ANIMATION_STATE.HIDDEN)
          }
        }
      }
    )

    const subscribeDiceAnimationState = useStateAnimation.subscribe(
      // SELECTOR
      state => state.dice_animation_state,

      // CALLBACK - IF THERE IS A MONSTER IN THIS ROOM, THEN THIS IS THE FINAL ANIMATION
      dice_animation_state => {
        const active_room = useStatePlayer.getState().room

        if (active_room.monster) {
          if (dice_animation_state === ANIMATION_STATE.VISIBLE) {
            setRoomAnimationState(ANIMATION_STATE.VISIBLE)
          }
          else if (dice_animation_state === ANIMATION_STATE.HIDDEN) {
            setRoomAnimationState(ANIMATION_STATE.HIDDEN)
          }
        }
      }
    )

    const subscribeRoomAnimationState = useStateAnimation.subscribe(
      // SELECTOR
      state => state.room_animation_state,

      // CALLBACK
      room_animation_state => {
        if (room_animation_state === ANIMATION_STATE.VISIBLE) {


          // STOPPED HERE -- FINAL ROOM CONSTRUCT ANIMATION COMPLETE >> GAME PHASE BASED ON MONSTER PRESENCE


          console.log('useEffect > SceneContent: room_animation_state', room_animation_state)
        }
      }
    )

    // CLEANUP
    return () => {
      subscribeGamePhase()
      subscribeWallAnimationState()
      subscribeDiceAnimationState()
      subscribeRoomAnimationState()
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