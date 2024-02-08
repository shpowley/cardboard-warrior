import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const PLAYER_DEFAULTS = {
  attack: 10,
  health: 100,
  potions: 3,
  gold: 0,
  key: false
}

const usePlayer = create(
  subscribeWithSelector(
    set => ({
      /** PROPERTIES */
      attack: PLAYER_DEFAULTS.attack,
      floor_index: null,
      room: null,
      health: PLAYER_DEFAULTS.health,
      potions: PLAYER_DEFAULTS.potions,
      gold: PLAYER_DEFAULTS.gold,
      key: PLAYER_DEFAULTS.key,

      /** METHODS */
      setFloorIndex: floor_index => set({ floor_index }),
      setRoom: room => set({ room }),

      // HEALTH
      takePotion: () => {
        set(state => {
          if (state.potions > 0) {
            return {
              health: Math.min(state.health + 10, 100), // max 100
              potions: state.potions - 1
            }
          }

          return {}
        })
      },

      takeDamage: damage => {
        set(state => ({ health: Math.max(state.health - damage, 0) }))
      },

      // GOLD (AT THIS TIME PLAYER ONLY GAINS GOLD)
      addGold: amount => {
        set(state => ({ gold: state.gold + amount }))
      },

      // KEY
      getKey: () => {
        set({ key: true })
      },

      useKey: () => {
        set({ key: false })
      }
    })
  )
)

export { PLAYER_DEFAULTS, usePlayer }