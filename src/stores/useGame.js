import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const GAME_PHASE = {
  GAME_INIT: 0,
  TITLE_SHOWING: 1,
  TITLE_VISIBLE: 2,
  TITLE_HIDING: 3,
  GAME_START: 4,
  ROOM_SHOWING: 5,
  ROOM_HIDING: 6,
  PLAYER_MOVEMENT: 7,
  PLAYER_COMBAT: 8,
  GAME_OVER: 9
}

const useGame = create(
  subscribeWithSelector(
    set => ({
      /** PROPERTIES */
      level: null,
      log: null,
      phase: GAME_PHASE.GAME_INIT,

      /** METHODS */
      setLevel: data => { set({ level: data }) },

      setLog: data => { set({ log: data }) },

      // STATE MACHINE
      setGamePhase: new_phase => {
        set(state => {
          if (state.phase !== new_phase) {
            switch (state.phase) {

              // GAME_INIT -> TITLE_SHOWING
              case GAME_PHASE.GAME_INIT:
                if (new_phase === GAME_PHASE.TITLE_SHOWING) {
                  return { phase: GAME_PHASE.TITLE_SHOWING }
                }

                break

              // TITLE_SHOWING -> TITLE_VISIBLE
              case GAME_PHASE.TITLE_SHOWING:
                if (new_phase === GAME_PHASE.TITLE_VISIBLE) {
                  return { phase: GAME_PHASE.TITLE_VISIBLE }
                }

                break

              // TITLE_VISIBLE -> TITLE_HIDING (INITIATED BY 'NEW GAME')
              case GAME_PHASE.TITLE_VISIBLE:
                if (new_phase === GAME_PHASE.TITLE_HIDING) {
                  return { phase: GAME_PHASE.TITLE_HIDING }
                }

                break

              // TITLE_HIDING -> GAME_START
              case GAME_PHASE.TITLE_HIDING:
                if (new_phase === GAME_PHASE.GAME_START) {
                  return { phase: GAME_PHASE.GAME_START }
                }

                break

              // GAME_START -> ROOM_SHOWING
              case GAME_PHASE.GAME_START:
                if (new_phase === GAME_PHASE.ROOM_SHOWING) {
                  return { phase: GAME_PHASE.ROOM_SHOWING }
                }

                break

              default:
                return {}
            }
          }

          return {}
        })
      }
    })
  )
)

export {
  GAME_PHASE,
  useGame
}