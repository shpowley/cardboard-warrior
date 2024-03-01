import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

import { GAME_PHASE, useStateGame } from '../../stores/useStateGame'
import { TRACKS, useStateBGM } from '../../stores/useStateBGM'
import { FILES, LINKS } from '../../common/Constants'
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
  const
    ref_group = useRef(),

    ref_text = {
      title: useRef(),
      new_game: useRef(),
      sound: useRef(),
      github: useRef()
    }

  // ANIMATIONS (anime.js)
  const animation_title = useRef()

  // SOUND
  let sound_enabled = true

  // ZUSTAND
  const
    setGamePhase = useStateGame(state => state.setGamePhase),
    setSoundEnabled = useStateBGM(state => state.setSoundEnabled)

  // HANDLERS
  const handlerNewGame = () => {
    setGamePhase(GAME_PHASE.TITLE_HIDING)
  }

  const handlerSound = () => {
    setSoundEnabled(!sound_enabled)
    getSoundState()
  }

  const getSoundState = () => {
    sound_enabled = useStateBGM.getState().sound_enabled

    if (ref_text.sound.current) {
      ref_text.sound.current.text = `SOUND: ${sound_enabled ? 'ON' : 'OFF'}`
    }
  }

  useEffect(() => {
    getSoundState()

    // GAME PHASE SUBSCRIPTION (ZUSTAND)
    const subscribe_game_phase = useStateGame.subscribe(
      // SELECTOR
      state => state.phase,

      // CALLBACK
      phase_subscribed => {
        // DETERMINE VISIBILITY BASED ON GAME PHASE
        if ([
          GAME_PHASE.GAME_INIT,
          GAME_PHASE.TITLE_SHOWING,
          GAME_PHASE.TITLE_VISIBLE,
          GAME_PHASE.TITLE_HIDING
        ].includes(phase_subscribed)) {
          if (!ref_group.current.visible) {
            ref_group.current.visible = true
          }
        }
        else {
          if (ref_group.current.visible) {
            ref_group.current.visible = false
          }
        }

        if (phase_subscribed === GAME_PHASE.TITLE_VISIBLE) {
          ref_text.new_game.current.__r3f.handlers.onPointerOver = mouse_pointer.over
        }
        else if (ref_text.new_game.current.__r3f.handlers.onPointerOver) {
          delete ref_text.new_game.current.__r3f.handlers.onPointerOver
        }

        // ANIMATIONS
        if (phase_subscribed === GAME_PHASE.TITLE_SHOWING) {
          ref_text.title.current.position.set(0, POSITIONS.TITLE.y.start, 0)
          ref_text.new_game.current.material.opacity = 0
          ref_text.sound.current.material.opacity = 0
          ref_text.github.current.material.opacity = 0

          animation_title.current = ANIMATIONS.title.show({
            target_title: ref_text.title.current.position,
            target_new_game: ref_text.new_game.current.material,
            target_sound: ref_text.sound.current.material,
            target_github: ref_text.github.current.material
          })

          // PROMISE WOULD ALSO WORK: ex. animation_title.current.finished.then()
          // .complete() IS USED TO DEMONSTRATE AS OTHER CALLBACKS ARE ALSO AVAILABLE (e.g. update)
          animation_title.current.complete = () => {
            setGamePhase(GAME_PHASE.TITLE_VISIBLE)
          }
        }

        else if (phase_subscribed === GAME_PHASE.TITLE_HIDING) {
          animation_title.current = ANIMATIONS.title.hide({
            target_title: ref_text.title.current.position,
            target_new_game: ref_text.new_game.current.material,
            target_sound: ref_text.sound.current.material,
            target_github: ref_text.github.current.material
          })

          // PROMISE WOULD ALSO WORK: ex. animation_title.current.finished.then()
          // .complete() IS USED TO DEMONSTRATE AS OTHER CALLBACKS ARE ALSO AVAILABLE (e.g. update)
          animation_title.current.complete = () => {
            setGamePhase(GAME_PHASE.GAME_START)
          }
        }
      }
    )

    // CLEAN UP
    return () => {
      subscribe_game_phase()
    }
  }, [])

  return <group
    ref={ref_group}
    scale={0.1}
    visible={true}
    dispose={null}
  >
    <Text
      ref={ref_text.title}
      font={FILES.FONT_BEBAS_NEUE}
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
      font={FILES.FONT_BEBAS_NEUE}
      material={material_title_details}
      position={[0, -1, 0]}
      scale={0.45}
      text='NEW GAME'

      onClick={handlerNewGame}
      onPointerOut={mouse_pointer.out}
    />
    <Text
      ref={ref_text.sound}
      font={FILES.FONT_BEBAS_NEUE}
      material={material_title_details}
      position={[0, -3.2, 0]}
      scale={0.23}
      anchorY='top'
      text='SOUND: ON'

      onClick={handlerSound}
      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />
    <Text
      ref={ref_text.github}
      font={FILES.FONT_BEBAS_NEUE}
      material={material_title_details}
      position={[0, -3.6, 0]}
      scale={0.23}
      anchorY='top'
      text='GITHUB / ATTRIBUTIONS'

      onClick={() => window.open(LINKS.GITHUB, '_blank')}
      onPointerOver={mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
    />
  </group>
}

export default memo(TitleScreen)