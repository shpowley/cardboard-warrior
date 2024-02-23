import { useEffect } from 'react'
import { button, useControls } from 'leva'

import { useStateGame } from '../../../stores/useStateGame'
import { DICE_STATE, useStateDice } from '../../../stores/useStateDice'
import { ANIMATION_STATE, useStateAnimation } from '../../../stores/useStateAnimation'
import { LEVA_SORT_ORDER } from '../../../common/Constants'
import D20Enemy from './D20Enemy'
import D20 from './D20'

const Dice = () => {
  const
    setDiceStateCombined = useStateDice(state => state.setDiceStateCombined),
    setDiceStatePlayer = useStateDice(state => state.setDiceStatePlayer),
    setDiceStateEnemy = useStateDice(state => state.setDiceStateEnemy),
    setDiceAnimationState = useStateAnimation(state => state.setDiceAnimationState),
    setCommand = useStateGame(state => state.setCommand)

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
    setDiceStateCombined(DICE_STATE.ROLL_COMPLETE)
    setCommand(null) // NECESSARY TO RESET COMMANDS TO NULL BEFORE SETTING NEW COMMANDS
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