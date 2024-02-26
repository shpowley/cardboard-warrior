import { Suspense, useEffect, useRef } from 'react'
import { Physics } from '@react-three/rapier'
import { button, useControls } from 'leva'

import { GAME_PHASE, useStateGame } from '../../stores/useStateGame'
import { useStatePlayer } from '../../stores/useStatePlayer'
import { ANIMATION_STATE, FINAL_ANIMATION, useStateAnimation } from '../../stores/useStateAnimation'
import { LEVA_SORT_ORDER } from '../../common/Constants'
import Room from './room/Room'
import Sign from './Sign'
import Warrior from './Warrior'
import Dice from './dice/Dice'

/**
 * RAPIER PHYSICS: https://github.com/pmndrs/react-three-rapier
 */
const SceneContent = () => {
  const ref_group = useRef()

  // ZUSTAND STATES
  const
    setGamePhase = useStateGame(state => state.setGamePhase),
    setLog = useStateGame(state => state.setLog),
    setRoomAnimationState = useStateAnimation(state => state.setRoomAnimationState),
    setWallAnimationState = useStateAnimation(state => state.setWallAnimationState),
    setMonsterSignAnimationState = useStateAnimation(state => state.setMonsterSignAnimationState),
    setPlayerAnimationState = useStateAnimation(state => state.setPlayerAnimationState),
    setDiceAnimationState = useStateAnimation(state => state.setDiceAnimationState),
    setFinalAnimation = useStateAnimation(state => state.setFinalAnimation)

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

      setFinalAnimation(active_room.monster ? FINAL_ANIMATION.DICE : FINAL_ANIMATION.WALL)
      setRoomAnimationState(ANIMATION_STATE.ANIMATING_TO_VISIBLE)
    }
  }

  const deconstructRoom = () => {
    const active_room = useStatePlayer.getState().room

    const {
      room_animation_state,
      wall_animation_state,
      player_animation_state,
      monster_sign_animation_state,
      dice_animation_state
    } = useStateAnimation.getState()

    if (room_animation_state === ANIMATION_STATE.VISIBLE) {
      if (active_room.monster) {
        if (dice_animation_state === ANIMATION_STATE.VISIBLE) {
          setDiceAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE)
        }

        if (monster_sign_animation_state === ANIMATION_STATE.VISIBLE) {
          setMonsterSignAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE, 1000)
        }
      }

      if (wall_animation_state === ANIMATION_STATE.VISIBLE) {
        setWallAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE, active_room.monster ? 2000 : 0)
      }

      if (player_animation_state === ANIMATION_STATE.VISIBLE) {
        setPlayerAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE, active_room.monster ? 3000 : 2000)
      }

      setFinalAnimation(FINAL_ANIMATION.PLAYER)
      setRoomAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE)
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

  useEffect(() => {
    // --- GAME PHASE SUBSCRIPTION (ZUSTAND) ---
    const subscribeGamePhase = useStateGame.subscribe(
      // SELECTOR
      state => state.phase,

      // CALLBACK
      phase_subscribed => {
        // DETERMINE VISIBILITY BASED ON GAME PHASE
        if ([
          GAME_PHASE.HUD_SHOWING,
          GAME_PHASE.ROOM_SHOWING,
          GAME_PHASE.ROOM_HIDING,
          GAME_PHASE.PLAYER_MOVEMENT,
          GAME_PHASE.PLAYER_COMBAT,
          GAME_PHASE.MONSTER_DEFEATED,
          GAME_PHASE.GAME_OVER
        ].includes(phase_subscribed)) {
          if (!ref_group.current.visible) {
            ref_group.current.visible = true
          }
        }
        else {
          if (ref_group.current.visible) {
            ref_group.current.visible = false
          }
        }

        // TRIGGERS ROOM CONSTRUCTION ANIMATIONS
        if (phase_subscribed === GAME_PHASE.ROOM_SHOWING) {
          buildRoom()
        }

        // TRIGGERS ROOM DECONSTRUCTION ANIMATIONS
        else if (phase_subscribed === GAME_PHASE.ROOM_HIDING) {
          deconstructRoom()
        }

        // MONSTER DEFEATED
        else if (phase_subscribed === GAME_PHASE.MONSTER_DEFEATED) {
          const
            monster_animation_state = useStateAnimation.getState().monster_sign_animation_state,
            dice_animation_state = useStateAnimation.getState().dice_animation_state

          if (dice_animation_state === ANIMATION_STATE.VISIBLE) {
            setDiceAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE, 3000)
          }

          if (monster_animation_state === ANIMATION_STATE.VISIBLE) {
            setMonsterSignAnimationState(ANIMATION_STATE.ANIMATING_TO_HIDE, 4000)
          }
        }
      }
    )

    // --- SCENE ANIMATIONS SUBSCRIPTION (ZUSTAND) (MONSTER DEFEATED) ---
    // - SPECIAL CASE: MONSTER DEFEATED
    const subscribeMonsterAnimationState = useStateAnimation.subscribe(
      // SELECTOR
      state => state.monster_sign_animation_state,

      // CALLBACK
      monster_animation_state => {
        if (monster_animation_state === ANIMATION_STATE.HIDDEN) {
          setGamePhase(GAME_PHASE.PLAYER_MOVEMENT)
        }
      }
    )

    // --- SCENE ANIMATIONS SUBSCRIPTION (ZUSTAND) ---
    const subscribeWallAnimationState = useStateAnimation.subscribe(
      // SELECTOR
      state => state.wall_animation_state,

      // CALLBACK
      wall_animation_state => {
        const final_animation = useStateAnimation.getState().final_animation

        if (final_animation === FINAL_ANIMATION.WALL && [ANIMATION_STATE.VISIBLE, ANIMATION_STATE.HIDDEN].includes(wall_animation_state)) {
          setRoomAnimationState(wall_animation_state)
        }
      }
    )

    const subscribeDiceAnimationState = useStateAnimation.subscribe(
      // SELECTOR
      state => state.dice_animation_state,

      // CALLBACK - IF THERE IS A MONSTER IN THIS ROOM, THEN SHOWING THE DICE IS THE FINAL ANIMATION
      dice_animation_state => {
        const final_animation = useStateAnimation.getState().final_animation

        if (final_animation === FINAL_ANIMATION.DICE && [ANIMATION_STATE.VISIBLE, ANIMATION_STATE.HIDDEN].includes(dice_animation_state)) {
          setRoomAnimationState(dice_animation_state)
        }
      }
    )

    const subscribePlayerAnimationState = useStateAnimation.subscribe(
      // SELECTOR
      state => state.player_animation_state,

      // CALLBACK
      player_animation_state => {
        const final_animation = useStateAnimation.getState().final_animation

        if (final_animation === FINAL_ANIMATION.PLAYER && [ANIMATION_STATE.VISIBLE, ANIMATION_STATE.HIDDEN].includes(player_animation_state)) {
          setRoomAnimationState(player_animation_state)
        }
      }
    )

    // 'room_animation_state' IS ANIMATION STATE FOR THE ENTIRE ROOM (BASICALLY ALL THE REQUIRED ANIMATIONS ARE COMPLETE)
    // - THE RESULT OF THE SUBSCRIPTIONS (WALL, DICE, PLAYER) -- ONLY ONE OF THESE WILL BE THE FINAL ANIMATION
    const subscribeRoomAnimationState = useStateAnimation.subscribe(
      // SELECTOR
      state => state.room_animation_state,

      // CALLBACK
      room_animation_state => {
        if (room_animation_state === ANIMATION_STATE.VISIBLE) {
          const active_room = useStatePlayer.getState().room

          // GAME PHASE BASED ON WHETHER A MONSTER IS PRESENT
          if (active_room.monster) {
            setGamePhase(GAME_PHASE.PLAYER_COMBAT)
          }
          else {
            const level_data = useStateGame.getState().level

            if (level_data.room_start.index === active_room.index) {
              setLog('LET\'S EXPLORE!')
            }
            else {
              let door_count = 0

              // COUNT THE NUMBER OF DOORS IN THE OBJECT LITERAL active_room.doors
              Object.values(active_room.doors).forEach(door => {
                if (door) {
                  door_count++
                }
              })

              if (door_count === 1) {
                setLog('A DEAD END.')
              }
              else {
                setLog('WHICH WAY?')
              }
            }

            setGamePhase(GAME_PHASE.PLAYER_MOVEMENT)
          }
        }
        else if (room_animation_state === ANIMATION_STATE.HIDDEN) {
          setTimeout(() => {
            setGamePhase(GAME_PHASE.ROOM_SHOWING)
          }, 1000)
        }
      }
    )

    // CLEANUP
    return () => {
      subscribeGamePhase()
      subscribeMonsterAnimationState()
      subscribeWallAnimationState()
      subscribeDiceAnimationState()
      subscribePlayerAnimationState
      subscribeRoomAnimationState()
    }
  }, [])

  return <Suspense fallback={null}>
    <Physics
      gravity={[0, -9.81, 0]}
      debug={controls_physics.debug}
    >
      <group
        ref={ref_group}
        visible={false}
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
      </group>
    </Physics>
  </Suspense>
}

export default SceneContent