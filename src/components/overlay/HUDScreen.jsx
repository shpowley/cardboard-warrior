import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

import { GAME_PHASE, useStateGame } from '../../stores/useStateGame'
import { ANIMATION_STATE, useStateAnimation } from '../../stores/useStateAnimation'
import { POSITIONS } from '../../common/Positions'
import ANIMATIONS from '../../common/Animation'
import HUDKeys from './HUDKeys'
import PlayerInfo from './PlayerInfo'
import EnemyInfo from './EnemyInfo'
import MiniMap from './MiniMap'
import GameLog from './GameLog'
import DiceResults from './DiceResults'

// COMMON MATERIALS
const material_text = new THREE.MeshBasicMaterial({
  color: 'black',
  toneMapped: false
})

const HUDScreen = () => {
  const ref_hud = {
    controls: useRef(),
    minimap: useRef(),
    game_log: useRef(),
    dice_results: useRef(),
    player: useRef(),
    enemy: useRef()
  }

  // ANIMATIONS (anime.js)
  const animation = useRef()

  // ZUSTAND GAME STATE
  const setGamePhase = useStateGame(state => state.setGamePhase)

  // USED TO HELP POSITION 2D HUD ELEMENTS
  const aspect_ratio = useThree(state => state.viewport.aspect)

  useEffect(() => {

    // GAME PHASE SUBSCRIPTION (ZUSTAND)
    const subscribeGamePhase = useStateGame.subscribe(
      // SELECTOR
      state => state.phase,

      // CALLBACK
      phase_subscribed => {
        if (phase_subscribed === GAME_PHASE.HUD_SHOWING) {
          // INITIAL VALUES
          ref_hud.controls.current.position.set(POSITIONS.KEYS.x, POSITIONS.KEYS.y.hidden, 0)

          animation.current = ANIMATIONS.animateHUDShow({
            target_controls: ref_hud.controls.current.position,
            target_player: ref_hud.player.current,
            target_minimap: ref_hud.minimap.current,
            target_log: ref_hud.game_log.current.material
          })

          // DON'T WAIT FOR ANIMATION TO BE FINISHED COMPLETELY AS IT TAKES ~2.5 SECONDS
          // START THE ROOM CONSTRUCTION A BIT EARLY (ROOM SHOWING PHASE)
          setTimeout(() => {
            setGamePhase(GAME_PHASE.ROOM_SHOWING)
          }, 1000)
        }
      }
    )

    // MONSTER ANIMATION SUBSCRIPTION (ZUSTAND)
    const subscribeMonsterAnimation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.monster_sign_animation_state,

      // CALLBACK
      animation_state => {
        if (animation_state === ANIMATION_STATE.VISIBLE) {
          ref_hud.minimap.current.visible = false
          ref_hud.enemy.current.visible = true
        }
        else if (animation_state === ANIMATION_STATE.HIDDEN) {
          ref_hud.minimap.current.visible = true
          ref_hud.enemy.current.visible = false
        }
      }
    )

    // CLEANUP
    return () => {
      subscribeGamePhase()
      subscribeMonsterAnimation()
    }
  }, [])

  return <>
    <HUDKeys
      forward_ref={ref_hud.controls}
    />

    <MiniMap
      forward_ref={ref_hud.minimap}
      aspect_ratio={aspect_ratio}
      material_text={material_text}
    />

    <GameLog
      forward_ref={ref_hud.game_log}
      aspect_ratio={aspect_ratio}
    />

    <DiceResults
      forward_ref={ref_hud.dice_results}
      aspect_ratio={aspect_ratio}
      material_text={material_text}
    />

    <PlayerInfo
      forward_ref={ref_hud.player}
      aspect_ratio={aspect_ratio}
      material_text={material_text}
    />

    <EnemyInfo
      forward_ref={ref_hud.enemy}
      aspect_ratio={aspect_ratio}
      material_text={material_text}
    />
  </>
}

export default HUDScreen