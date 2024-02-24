import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { MESH_ANIMATIONS } from '../components/scene/Warrior'

const PLAYER_DEFAULTS = {
  attack: 10,
  max_health: 100,
  health: 100,
  potions: 3,
  gold: 0,
  key: false
}

const useStatePlayer = create(
  subscribeWithSelector(
    set => ({
      /** PROPERTIES */
      attack: PLAYER_DEFAULTS.attack,
      floor_index: null,
      room: null,
      max_health: PLAYER_DEFAULTS.max_health,
      health: PLAYER_DEFAULTS.health,
      potions: PLAYER_DEFAULTS.potions,
      gold: PLAYER_DEFAULTS.gold,
      key: PLAYER_DEFAULTS.key,
      animation: MESH_ANIMATIONS.NONE,

      /** METHODS */
      setFloorIndex: floor_index => set({ floor_index }),
      setRoom: room => set({ room }),

      // HEALTH
      addPotion: () => {
        set(state => ({ potions: state.potions + 1 }))
      },

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
      },

      // ANIMATION
      setAnimation: animation => {
        set({ animation })
      }
    })
  )
)

export {
  PLAYER_DEFAULTS,
  useStatePlayer
}