import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const DICE_STATE = {
  NONE: 0,
  FALLING: 1,
  ROLLING: 2,
  ROLL_COMPLETE: 3
}

const useStateDice = create(
  subscribeWithSelector(
    set => ({
      /** PROPERTIES */
      dice_state_player: DICE_STATE.NONE,
      dice_value_player: 1,

      dice_state_enemy: DICE_STATE.NONE,
      dice_value_enemy: 1,

      /** METHODS */
      setDiceStatePlayer: dice_state_player => { set({ dice_state_player }) },
      setDiceValuePlayer: dice_value_player => { set({ dice_value_player }) },

      setDiceStateEnemy: dice_state_enemy => { set({ dice_state_enemy }) },
      setDiceValueEnemy: dice_value_enemy => { set({ dice_value_enemy }) }
    })
  )
)

export {
  DICE_STATE,
  useStateDice
}