import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

import { FILE_FONT_BEBAS_NEUE, LINK_GITHUB } from '../../common/Constants'
import { GAME_PHASE, useGame } from '../../stores/useGame'
import ANIMATIONS from '../../common/Animation'
import { POSITIONS } from '../../common/Positions'
import { mouse_pointer } from '../../common/Utils'

// COMMON MATERIALS
const
  material_title = new THREE.MeshBasicMaterial({
    toneMapped: false
  }),

  material_title_details = new THREE.MeshBasicMaterial({
    color: '#0b4498',
    opacity: 0,
    toneMapped: false
  })

const TitleScreen = () => {
  console.log('RENDER: TitleScreen')

  const ref_text = {
    title: useRef(),
    new_game: useRef(),
    github: useRef()
  }

  // ANIMATIONS (anime.js)
  const animation_title = useRef()

  // ZUSTAND GAME STATE
  const
    setGamePhase = useGame(state => state.setGamePhase),
    phase = useGame(state => state.phase)

  // HANDLERS
  const handlerNewGame = () => {
    console.log('TitleScreen: NEW GAME handler')
    setGamePhase(GAME_PHASE.TITLE_HIDING)
  }

  useEffect(() => {

    // GAME PHASE SUBSCRIPTION (ZUSTAND)
    const subscribeGamePhase = useGame.subscribe(
      // SELECTOR
      state => state.phase,

      // CALLBACK
      phase_subscribed => {
        if (phase_subscribed === GAME_PHASE.TITLE_SHOWING) {
          console.log('useEffect > TitleScreen: GAME_PHASE.TITLE_SHOWING')

          ref_text.title.current.position.set(0, POSITIONS.TITLE.y.start, 0)
          ref_text.new_game.current.material.opacity = 0
          ref_text.github.current.material.opacity = 0

          animation_title.current = ANIMATIONS.animateTitleShow({
            target_title: ref_text.title.current.position,
            target_new_game: ref_text.new_game.current.material,
            target_github: ref_text.github.current.material
          })

          // PROMISE WOULD ALSO WORK: ex. animation_title.current.finished.then()
          // .complete() IS USED TO DEMONSTRATE AS OTHER CALLBACKS ARE ALSO AVAILABLE (e.g. update)
          animation_title.current.complete = () => {
            console.log('useEffect > TitleScreen: SHOW COMPLETE')
            setGamePhase(GAME_PHASE.TITLE_VISIBLE)
          }
        }

        else if (phase_subscribed === GAME_PHASE.TITLE_VISIBLE) {
          console.log('useEffect > TitleScreen: GAME_PHASE.TITLE_VISIBLE')
          // WAITING FOR USER INPUT
        }

        else if (phase_subscribed === GAME_PHASE.TITLE_HIDING) {
          console.log('useEffect > TitleScreen: GAME_PHASE.TITLE_HIDING')

          animation_title.current = ANIMATIONS.animateTitleHide({
            target_title: ref_text.title.current.position,
            target_new_game: ref_text.new_game.current.material,
            target_github: ref_text.github.current.material
          })

          // PROMISE WOULD ALSO WORK: ex. animation_title.current.finished.then()
          // .complete() IS USED TO DEMONSTRATE AS OTHER CALLBACKS ARE ALSO AVAILABLE (e.g. update)
          animation_title.current.complete = () => {
            console.log('useEffect > TitleScreen: HIDE COMPLETE')
            setGamePhase(GAME_PHASE.GAME_START)
          }
        }
      }
    )

    // CLEAN UP
    return () => {
      subscribeGamePhase()
    }
  }, [])

  return <group
    scale={0.1}
    visible={true}
    dispose={null}
  >
    <Text
      ref={ref_text.title}
      font={FILE_FONT_BEBAS_NEUE}
      material={material_title}
      color='#745f40'
      position={[0, POSITIONS.TITLE.y.start, 0]} // OFFSCREEN START POSITIONS
      textAlign='center'
      lineHeight={0.9}
      outlineWidth={0.015}
      text={'CARDBOARD\nWARRIOR'}
    />
    <Text
      ref={ref_text.new_game}
      font={FILE_FONT_BEBAS_NEUE}
      material={material_title_details}
      position={[0, -1, 0]}
      scale={0.45}
      text='NEW GAME'

      onClick={handlerNewGame}
      onPointerOver={phase === GAME_PHASE.TITLE_VISIBLE && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />
    <Text
      ref={ref_text.github}
      font={FILE_FONT_BEBAS_NEUE}
      material={material_title_details}
      position={[0, -3.6, 0]}
      scale={0.23}
      anchorY='top'
      textAlign={'left'}
      text='GITHUB / ATTRIBUTIONS'

      onClick={() => window.open(LINK_GITHUB, '_blank')}
      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />
  </group>
}

export default memo(TitleScreen)