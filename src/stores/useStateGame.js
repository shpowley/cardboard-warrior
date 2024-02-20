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
      command: null,
      phase: GAME_PHASE.GAME_INIT,

      /** METHODS */
      setControls: controls => set({ controls }),
      setLevel: data => set({ level: data }),
      setLog: data => set({ log: data }),
      setCommand: command => set({ command }),

      // STATE MACHINE
      setGamePhase: new_phase => {
        set(state => {
          if (state.phase !== new_phase) {
            switch (state.phase) {

              // GAME_INIT -> TITLE_SHOWING
              case GAME_PHASE.GAME_INIT:
                if (new_phase === GAME_PHASE.TITLE_SHOWING) {
                  return { phase: new_phase }
                }

                break

              // TITLE_SHOWING -> TITLE_VISIBLE
              case GAME_PHASE.TITLE_SHOWING:
                if (new_phase === GAME_PHASE.TITLE_VISIBLE) {
                  return { phase: new_phase }
                }

                break

              // TITLE_VISIBLE -> TITLE_HIDING (INITIATED BY 'NEW GAME')
              case GAME_PHASE.TITLE_VISIBLE:
                if (new_phase === GAME_PHASE.TITLE_HIDING) {
                  return { phase: new_phase }
                }

                break

              // TITLE_HIDING -> GAME_START
              case GAME_PHASE.TITLE_HIDING:
                if (new_phase === GAME_PHASE.GAME_START) {
                  return { phase: new_phase }
                }

                break

              // GAME_START -> HUD_SHOWING
              case GAME_PHASE.GAME_START:
                if (new_phase === GAME_PHASE.HUD_SHOWING) {
                  return { phase: new_phase }
                }

                break

              // HUD_SHOWING -> ROOM_SHOWING
              case GAME_PHASE.HUD_SHOWING:
                if (new_phase === GAME_PHASE.ROOM_SHOWING) {
                  return { phase: new_phase }
                }

                break

              // ROOM_SHOWING -> PLAYER_COMBAT or PLAYER_MOVEMENT
              case GAME_PHASE.ROOM_SHOWING:
                if (new_phase === GAME_PHASE.PLAYER_COMBAT || new_phase === GAME_PHASE.PLAYER_MOVEMENT) {
                  return { phase: new_phase }
                }

                break
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