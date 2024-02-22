import { useEffect } from 'react'
import { button, useControls } from 'leva'

import D20 from './D20'
import D20Enemy from './D20Enemy'
import { LEVA_SORT_ORDER } from '../../../common/Constants'
import { DICE_STATE, useStateDice } from '../../../stores/useStateDice'
import { ANIMATION_STATE, useStateAnimation } from '../../../stores/useStateAnimation'
import { useStateGame } from '../../../stores/useStateGame'

const Dice = () => {
  const
    setDiceStatePlayer = useStateDice(state => state.setDiceStatePlayer),
    setDiceStateEnemy = useStateDice(state => state.setDiceStateEnemy),
    setDiceAnimationState = useStateAnimation(state => state.setDiceAnimationState),
    setCommand = useStateGame(state => state.setCommand),
    setLog = useStateGame(state => state.setLog)

  useControls(
    'dice rolling',

    {
      'roll d20 (player)': button(() => {
        setDiceStatePlayer(DICE_STATE.ROLLING)
      }),

      'roll d20 (enemy)': button(() => {
        setDiceStateEnemy(DICE_STATE.ROLLING)
      })
    },

    {
      collapsed: true,
      order: LEVA_SORT_ORDER.DICE_ROLL
    }
  )

  // BOTH DICE FINISHED ROLLING
  const diceRollsComplete = () => {
    const
      roll_player = useStateDice.getState().dice_value_player,
      roll_enemy = useStateDice.getState().dice_value_enemy

    setLog(`PLAYER: ${roll_player}\nENEMY: ${roll_enemy}`)

    setCommand(null)
  }

  useEffect(() => {
    // DICE ROLL SUBSCRIPTION (ZUSTAND)
    const
      subscribePlayerDiceRollComplete = useStateDice.subscribe(
        // SELECTOR
        state => state.dice_state_player,

        // CALLBACK
        dice_state => {
          if (dice_state === DICE_STATE.ROLL_COMPLETE) {
            const dice_state_enemy = useStateDice.getState().dice_state_enemy

            if (dice_state_enemy === DICE_STATE.ROLL_COMPLETE) {
              diceRollsComplete()
            }
          }
          else if (dice_state === DICE_STATE.FALL_COMPLETE && useStateDice.getState().dice_state_enemy === DICE_STATE.FALL_COMPLETE) {
            setDiceAnimationState(ANIMATION_STATE.VISIBLE) // A BIT COMPLEX ..BOTH DICE NEED TO HAVE FALLEN BEFORE ANIMATION STATE CAN BE SET. REPEATED BELOW.
          }
          else if (dice_state === DICE_STATE.HIDE_COMPLETE && useStateDice.getState().dice_state_enemy === DICE_STATE.HIDE_COMPLETE) {
            setDiceAnimationState(ANIMATION_STATE.HIDDEN)
          }
        }
      ),

      subscribeEnemyDiceRollComplete = useStateDice.subscribe(
        // SELECTOR
        state => state.dice_state_enemy,

        // CALLBACK
        dice_state => {
          if (dice_state === DICE_STATE.ROLL_COMPLETE) {
            const dice_state_player = useStateDice.getState().dice_state_player

            if (dice_state_player === DICE_STATE.ROLL_COMPLETE) {
              diceRollsComplete()
            }
          }
          else if (dice_state === DICE_STATE.FALL_COMPLETE && useStateDice.getState().dice_state_player === DICE_STATE.FALL_COMPLETE) {
            setDiceAnimationState(ANIMATION_STATE.VISIBLE)
          }
          else if (dice_state === DICE_STATE.HIDE_COMPLETE && useStateDice.getState().dice_state_player === DICE_STATE.HIDE_COMPLETE) {
            setDiceAnimationState(ANIMATION_STATE.HIDDEN)
          }
        }
      )

    // CLEANUP
    return () => {
      subscribePlayerDiceRollComplete()
      subscribeEnemyDiceRollComplete()
    }
  }, [])

  return <group dispose={null}>
    <D20 castShadow />
    <D20Enemy castShadow />
  </group>
}

export default Dice