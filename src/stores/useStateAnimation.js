import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/** ZUSTAND ANIMATION STATES
 * - HELPS MANAGE ANIME.JS ANIMATION STATES
 *   ROOM (WALLS), MONSTER SIGN, PLAYER, DICE
 */
const ANIMATION_STATE = {
  HIDDEN: 0,
  VISIBLE: 1,
  ANIMATING_TO_HIDE: 2,
  ANIMATING_TO_VISIBLE: 3
}

const useStateAnimation = create(
  subscribeWithSelector(
    set => ({
      /** PROPERTIES */
      room_animation_state: ANIMATION_STATE.HIDDEN,
      player_animation_state: ANIMATION_STATE.HIDDEN,
      monster_sign_animation_state: ANIMATION_STATE.HIDDEN,
      dice_animation_state: ANIMATION_STATE.HIDDEN,

      /** METHODS (STATE MACHINES)
       *  - THESE WILL TRIGGER THE APPROPRIATE COMPONENT SUBSCRIPTION
       *    AND IN TURN, THE APPROPRIATE ANIME.JS ANIMATIONS
       */
      setRoomAnimationState: new_state => {
        set(state => {
          if (state.room_animation_state !== new_state) {
            switch (state.room_animation_state) {
              case ANIMATION_STATE.HIDDEN:
                if (new_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
                  return { room_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.ANIMATING_TO_VISIBLE:
                if (new_state === ANIMATION_STATE.VISIBLE) {
                  return { room_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.VISIBLE:
                if (new_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
                  return { room_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.ANIMATING_TO_HIDE:
                if (new_state === ANIMATION_STATE.HIDDEN) {
                  return { room_animation_state: new_state }
                }
            }
          }

          return {}
        })
      },

      setPlayerAnimationState: new_state => {
        set(state => {
          if (state.player_animation_state !== new_state) {
            switch (state.player_animation_state) {
              case ANIMATION_STATE.HIDDEN:
                if (new_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
                  return { player_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.ANIMATING_TO_VISIBLE:
                if (new_state === ANIMATION_STATE.VISIBLE) {
                  return { player_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.VISIBLE:
                if (new_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
                  return { player_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.ANIMATING_TO_HIDE:
                if (new_state === ANIMATION_STATE.HIDDEN) {
                  return { player_animation_state: new_state }
                }
            }
          }

          return {}
        })
      },

      setMonsterSignAnimationState: new_state => {
        set(state => {
          if (state.monster_sign_animation_state !== new_state) {
            switch (state.monster_sign_animation_state) {
              case ANIMATION_STATE.HIDDEN:
                if (new_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
                  return { monster_sign_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.ANIMATING_TO_VISIBLE:
                if (new_state === ANIMATION_STATE.VISIBLE) {
                  return { monster_sign_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.VISIBLE:
                if (new_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
                  return { monster_sign_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.ANIMATING_TO_HIDE:
                if (new_state === ANIMATION_STATE.HIDDEN) {
                  return { monster_sign_animation_state: new_state }
                }
            }
          }

          return {}
        })
      },

      setDiceAnimationState: new_state => {
        set(state => {
          if (state.dice_animation_state !== new_state) {
            switch (state.dice_animation_state) {
              case ANIMATION_STATE.HIDDEN:
                if (new_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
                  return { dice_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.ANIMATING_TO_VISIBLE:
                if (new_state === ANIMATION_STATE.VISIBLE) {
                  return { dice_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.VISIBLE:
                if (new_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
                  return { dice_animation_state: new_state }
                }

                break

              case ANIMATION_STATE.ANIMATING_TO_HIDE:
                if (new_state === ANIMATION_STATE.HIDDEN) {
                  return { dice_animation_state: new_state }
                }
            }
          }

          return {}
        })
      }
    })
  )
)

export {
  ANIMATION_STATE,
  useStateAnimation
}