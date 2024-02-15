import { useEffect } from 'react'
import { button, useControls } from 'leva'

import D20 from './D20'
import D20Enemy from './D20Enemy'
import { LEVA_SORT_ORDER } from '../../../common/Constants'
import { DICE_STATE, useStateDice } from '../../../stores/useStateDice'
import { ANIMATION_STATE, useStateAnimation } from '../../../stores/useStateAnimation'

const Dice = () => {
  const
    setDiceStatePlayer = useStateDice(state => state.setDiceStatePlayer),
    setDiceStateEnemy = useStateDice(state => state.setDiceStateEnemy),
    setDiceAnimationState = useStateAnimation(state => state.setDiceAnimationState)

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

  useEffect(() => {
    // DICE ROLL SUBSCRIPTION (ZUSTAND)
    const
      subscribePlayerDiceRollComplete = useStateDice.subscribe(
        // SELECTOR
        state => state.dice_state_player,

        // CALLBACK
        dice_state => {
          if (dice_state === DICE_STATE.ROLL_COMPLETE) {
            console.log('D20 PLAYER ROLL: ', useStateDice.getState().dice_value_player)
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
            console.log('D20 ENEMY ROLL: ', useStateDice.getState().dice_value_enemy)
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