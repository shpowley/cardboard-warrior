import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const GAME_PHASE = {
  GAME_INIT: 0,
  TITLE_SHOWING: 1,
  TITLE_VISIBLE: 2,
  TITLE_HIDING: 3,
  GAME_START: 4,
  HUD_SHOWING: 5,
  ROOM_SHOWING: 6,
  ROOM_HIDING: 7,
  PLAYER_MOVEMENT: 8,
  PLAYER_COMBAT: 9,
  GAME_OVER: 10
}

const useStateGame = create(
  subscribeWithSelector(
    set => ({
      /** PROPERTIES */
      controls: null, // ORBIT CONTROLS REF TO GRANDCHILD COMPONENT
      level: null,
      log: null,
      phase: GAME_PHASE.GAME_INIT,

      /** METHODS */
      setControls: controls => set({ controls }),
      setLevel: data => set({ level: data }),
      setLog: data => set({ log: data }),

      // STATE MACHINE
      setGamePhase: phase => {
        set(state => {
          if (state.phase !== phase) {
            switch (state.phase) {

              // GAME_INIT -> TITLE_SHOWING
              case GAME_PHASE.GAME_INIT:
                if (phase === GAME_PHASE.TITLE_SHOWING) {
                  return { phase }
                }

                break

              // TITLE_SHOWING -> TITLE_VISIBLE
              case GAME_PHASE.TITLE_SHOWING:
                if (phase === GAME_PHASE.TITLE_VISIBLE) {
                  return { phase }
                }

                break

              // TITLE_VISIBLE -> TITLE_HIDING (INITIATED BY 'NEW GAME')
              case GAME_PHASE.TITLE_VISIBLE:
                if (phase === GAME_PHASE.TITLE_HIDING) {
                  return { phase }
                }

                break

              // TITLE_HIDING -> GAME_START
              case GAME_PHASE.TITLE_HIDING:
                if (phase === GAME_PHASE.GAME_START) {
                  return { phase }
                }

                break

              // GAME_START -> HUD_SHOWING
              case GAME_PHASE.GAME_START:
                if (phase === GAME_PHASE.HUD_SHOWING) {
                  return { phase }
                }

                break

              // HUD_SHOWING -> ROOM_SHOWING
              case GAME_PHASE.HUD_SHOWING:
                if (phase === GAME_PHASE.ROOM_SHOWING) {
                  return { phase }
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
  GAME_PHASE,
  useStateGame
}