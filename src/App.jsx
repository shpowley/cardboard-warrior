import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Leva, useControls } from 'leva'

import { CAMERA_DEFAULTS, COMMAND, LEVA_SORT_ORDER, TONE_MAPPING_OPTIONS } from './common/Constants'
import { parameterEnabled } from './common/Utils'
import Experience from './Experience'

// LEVA DEBUG
const debug_enabled = parameterEnabled('DEBUG') || parameterEnabled('debug')

const App = () => {

  // TONE MAPPING WITH REACT THREE FIBER
  // https://discourse.threejs.org/t/tone-mapping-change-tonemapping-type/48266/4
  const controls_gl = useControls(
    'tone mapping',

    {
      tone_mapping: {
        label: 'tone',
        value: THREE.ReinhardToneMapping,
        options: TONE_MAPPING_OPTIONS,
      },

      tone_exposure: {
        label: 'exposure',
        value: 1.0,
        min: 0,
        max: 5,
        step: 0.1,
      },
    },

    { collapsed: true, order: LEVA_SORT_ORDER.TONE_MAPPING }
  )

  return <>
    <Leva
      hidden={!debug_enabled}
      collapsed

      titleBar={{
        drag: true,
        title: 'DEBUG PANEL',
        filter: false,
      }}
    />

    <Canvas
      gl={{
        toneMapping: controls_gl.tone_mapping,
        toneMappingExposure: controls_gl.tone_exposure,
      }}

      shadows={{
        enabled: true,
        type: THREE.PCFSoftShadowMap
      }}

      camera={{
        fov: CAMERA_DEFAULTS.fov,
        near: CAMERA_DEFAULTS.near,
        far: CAMERA_DEFAULTS.far,
        position: CAMERA_DEFAULTS.position
      }}
    >
      <KeyboardControls
        map={[
          { name: COMMAND.NORTH, keys: ['KeyW', 'ArrowUp'] },
          { name: COMMAND.SOUTH, keys: ['KeyS', 'ArrowDown'] },
          { name: COMMAND.EAST, keys: ['KeyD', 'ArrowRight'] },
          { name: COMMAND.WEST, keys: ['KeyA', 'ArrowLeft'] },
          { name: COMMAND.ROLL_DICE, keys: ['Space'] },
          { name: COMMAND.POTION, keys: ['1'] }
        ]}
      >
        <Experience />
      </KeyboardControls>
    </Canvas>
  </>
}

export default App