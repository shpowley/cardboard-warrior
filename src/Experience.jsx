import { useEffect, useRef, lazy } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { Environment, OrbitControls, useHelper, useKeyboardControls } from '@react-three/drei'
import { useControls, folder } from 'leva'

import { GAME_PHASE, useStateGame } from './stores/useStateGame'
import { useStatePlayer } from './stores/useStatePlayer'
import { DICE_STATE, useStateDice } from './stores/useStateDice'
import ScreenOverlay from './components/overlay/ScreenOverlay'
import SceneContent from './components/scene/SceneContent'
import { CAMERA_DEFAULTS, COMMAND, FILES, LEVA_SORT_ORDER, LIGHTING_DEFAULTS } from './common/Constants'
import { parameterEnabled } from './common/Utils'
import { DIRECTION, FLOOR_ITEMS, generateLevel } from './common/Level'

// LEVA DEBUG
const debug_enabled = parameterEnabled('DEBUG') || parameterEnabled('debug')

// DYNAMIC IMPORT FOR R3F PERFORMANCE MONITOR
let Perf = null

if (parameterEnabled('PERF') || parameterEnabled('perf')) {
  Perf = lazy(() => import('r3f-perf').then(module => ({ default: module.Perf })))
}

/**
 * THIS EXAMPLE USES ANIMEJS FOR ANIMATION
 * - https://animejs.com/
 *
 *   USEFUL GETTING STARTED WITH ANIMEJS IN REACT
 *   - https://www.upbeatcode.com/react/how-to-use-anime-js-in-react/
 *
 *   CAMERA ANIMATION EXAMPLE (PRETTY GOOD - USES TWEEN.JS)
 *   - https://editor.sbcode.net/84aa7f9383849f49a83f810972f5c51e69721658
 */
const Experience = () => {
  const
    ref_orbit_controls = useRef(),
    ref_directional_light = useRef(),
    ref_shadow_camera = useRef()

  // ZUSTAND GAME STATE
  const
    setFloorIndex = useStatePlayer(state => state.setFloorIndex),
    setRoom = useStatePlayer(state => state.setRoom),
    useKey = useStatePlayer(state => state.useKey),
    takePotion = useStatePlayer(state => state.takePotion),
    setDiceStateCombined = useStateDice(state => state.setDiceStateCombined),
    setDiceStatePlayer = useStateDice(state => state.setDiceStatePlayer),
    setDiceStateEnemy = useStateDice(state => state.setDiceStateEnemy),
    setControls = useStateGame(state => state.setControls),
    setLevel = useStateGame(state => state.setLevel),
    setLog = useStateGame(state => state.setLog),
    setCommand = useStateGame(state => state.setCommand),
    setGamePhase = useStateGame(state => state.setGamePhase),
    setRenderTitleScreen = useStateGame(state => state.setRenderTitleScreen)

  // KEYBOARD CONTROLS
  const [keyboard_subscribe, keyboard_get] = useKeyboardControls()

  // LEVA CAMERA & ORBIT CONTROLS
  const camera = useThree((state) => state.camera)

  const [_, setControlsCamera] = useControls(
    'camera',

    () => ({
      fov: {
        value: CAMERA_DEFAULTS.fov,
        min: 1,
        max: 120,
        step: 1,

        onChange: value => {
          camera.fov = value
          camera.updateProjectionMatrix()
        }
      },

      near: {
        value: CAMERA_DEFAULTS.near,
        min: 0.1,
        max: 50,
        step: 0.1,

        onChange: value => {
          camera.near = value
          camera.updateProjectionMatrix()
        }
      },

      far: {
        value: CAMERA_DEFAULTS.far,
        min: 50,
        max: 1000,
        step: 1,

        onChange: value => {
          camera.far = value
          camera.updateProjectionMatrix()
        }
      },

      position: folder(
        {
          pos_x: {
            label: 'x',
            value: CAMERA_DEFAULTS.position[0],
            min: -CAMERA_DEFAULTS.leva_min_max,
            max: CAMERA_DEFAULTS.leva_min_max,
            step: 0.1,

            onChange: value => {
              camera.position.x = value
              camera.updateProjectionMatrix()
            }
          },

          pos_y: {
            label: 'y',
            value: CAMERA_DEFAULTS.position[1],
            min: -CAMERA_DEFAULTS.leva_min_max,
            max: CAMERA_DEFAULTS.leva_min_max,
            step: 0.1,

            onChange: value => {
              camera.position.y = value
              camera.updateProjectionMatrix()
            }
          },

          pos_z: {
            label: 'z',
            value: CAMERA_DEFAULTS.position[2],
            min: -CAMERA_DEFAULTS.leva_min_max,
            max: CAMERA_DEFAULTS.leva_min_max,
            step: 0.1,

            onChange: value => {
              camera.position.z = value
              camera.updateProjectionMatrix()
            }
          },
        },
        { collapsed: true }
      ),

      'orbit look at': folder(
        {
          look_at_x: {
            label: 'x',
            value: CAMERA_DEFAULTS.look_at[0],
            min: -CAMERA_DEFAULTS.leva_min_max,
            max: CAMERA_DEFAULTS.leva_min_max,
            step: 0.1,

            onChange: value => {
              ref_orbit_controls.current.target.x = value
            }
          },

          look_at_y: {
            label: 'y',
            value: CAMERA_DEFAULTS.look_at[1],
            min: -CAMERA_DEFAULTS.leva_min_max,
            max: CAMERA_DEFAULTS.leva_min_max,
            step: 0.1,

            onChange: value => {
              ref_orbit_controls.current.target.y = value
            }
          },

          look_at_z: {
            label: 'z',
            value: CAMERA_DEFAULTS.look_at[2],
            min: -CAMERA_DEFAULTS.leva_min_max,
            max: CAMERA_DEFAULTS.leva_min_max,
            step: 0.1,

            onChange: value => {
              ref_orbit_controls.current.target.z = value
            }
          },
        },
        { collapsed: true }
      )
    }),

    { collapsed: true, order: LEVA_SORT_ORDER.CAMERA }
  )

  // LEVA LIGHTS
  const controls_lighting = useControls(
    'lighting',

    {
      'ambient light': folder(
        {
          ambient_intensity: {
            label: 'intensity',
            value: LIGHTING_DEFAULTS.ambient_intensity,
            min: 0,
            max: 10,
            step: 0.1
          },

          ambient_color: {
            label: 'color',
            value: LIGHTING_DEFAULTS.ambient_color
          },
        },

        { collapsed: true }
      ),

      'directional light': folder(
        {
          directional_helper: {
            label: 'helper',
            value: false,
          },

          directional_intensity: {
            label: 'intensity',
            value: LIGHTING_DEFAULTS.directional_intensity,
            min: 0,
            max: 10,
            step: 0.1
          },

          'position': folder(
            {
              directional_pos_x: {
                label: 'x',
                value: LIGHTING_DEFAULTS.directional_position[0],
                min: -CAMERA_DEFAULTS.leva_min_max,
                max: CAMERA_DEFAULTS.leva_min_max,
                step: 0.1
              },

              directional_pos_y: {
                label: 'y',
                value: LIGHTING_DEFAULTS.directional_position[1],
                min: -CAMERA_DEFAULTS.leva_min_max,
                max: CAMERA_DEFAULTS.leva_min_max,
                step: 0.1
              },

              directional_pos_z: {
                label: 'z',
                value: LIGHTING_DEFAULTS.directional_position[2],
                min: -CAMERA_DEFAULTS.leva_min_max,
                max: CAMERA_DEFAULTS.leva_min_max,
                step: 0.1
              },
            },
          ),

          directional_color: {
            label: 'color',
            value: LIGHTING_DEFAULTS.directional_color
          },
        },

        { collapsed: true }
      ),

      'shadow': folder(
        {
          shadow_enabled: {
            label: 'enabled',
            value: true,
          },

          shadow_helper: {
            label: 'helper',
            value: false,
          },

          shadow_color: {
            label: 'color',
            value: LIGHTING_DEFAULTS.shadow_color
          },

          shadow_opacity: {
            label: 'opacity',
            value: LIGHTING_DEFAULTS.shadow_opacity,
            min: 0,
            max: 1,
            step: 0.01
          },

          shadow_near: {
            label: 'near',
            value: LIGHTING_DEFAULTS.shadow_near,
            min: 0,
            max: 5,
            step: 0.01,

            onChange: value => {
              ref_shadow_camera.current.near = value
              ref_shadow_camera.current.updateProjectionMatrix()
            }
          },

          shadow_far: {
            label: 'far',
            value: LIGHTING_DEFAULTS.shadow_far,
            min: 5,
            max: 20,
            step: 0.1,

            onChange: value => {
              ref_shadow_camera.current.far = value
              ref_shadow_camera.current.updateProjectionMatrix()
            }
          },

          shadow_left: {
            label: 'left',
            value: LIGHTING_DEFAULTS.shadow_left,
            min: -15,
            max: 0,
            step: 0.1,

            onChange: value => {
              ref_shadow_camera.current.left = value
              ref_shadow_camera.current.updateProjectionMatrix()
            }
          },

          shadow_right: {
            label: 'right',
            value: LIGHTING_DEFAULTS.shadow_right,
            min: 1,
            max: 15,
            step: 0.1,

            onChange: value => {
              ref_shadow_camera.current.right = value
              ref_shadow_camera.current.updateProjectionMatrix()
            }
          },

          shadow_top: {
            label: 'top',
            value: LIGHTING_DEFAULTS.shadow_top,
            min: 1,
            max: 15,
            step: 0.1,

            onChange: value => {
              ref_shadow_camera.current.top = value
              ref_shadow_camera.current.updateProjectionMatrix()
            }
          },

          shadow_bottom: {
            label: 'bottom',
            value: LIGHTING_DEFAULTS.shadow_bottom,
            min: -15,
            max: 0,
            step: 0.1,

            onChange: value => {
              ref_shadow_camera.current.bottom = value
              ref_shadow_camera.current.updateProjectionMatrix()
            }
          },
        },

        { collapsed: true }
      ),
    },

    { collapsed: true, order: LEVA_SORT_ORDER.LIGHTING }
  )

  // HELPERS
  useHelper(
    controls_lighting.shadow_helper && ref_shadow_camera,
    THREE.CameraHelper
  )

  useHelper(
    controls_lighting.directional_helper && ref_directional_light,
    THREE.DirectionalLightHelper,
    1, // size has no effect ..something to do gl lines?
    '#ff0'
  )

  // COMMANDS PROCESSING
  const processCommand = command => {
    const phase = useStateGame.getState().phase

    if (![GAME_PHASE.PLAYER_MOVEMENT, GAME_PHASE.PLAYER_COMBAT].includes(phase)) {
      setCommand(null)
      return
    }

    // POTIONS (COMBAT OR MOVEMENT PHASES)
    if (command === COMMAND.POTION) {
      const potions = useStatePlayer.getState().potions

      if (potions > 0) {
        takePotion(FLOOR_ITEMS.HEALTH_POTION.value)
        setCommand(null)
        setLog('YOU DRINK A POTION')
      }
      else {
        setLog('NO POTIONS LEFT!')
      }
    }

    // DICE (COMBAT PHASE ONLY)
    else if (command === COMMAND.ROLL_DICE) {
      if (phase === GAME_PHASE.PLAYER_COMBAT) {
        setLog('ROLLING DICE...')

        setDiceStateCombined(DICE_STATE.ROLLING)
        setDiceStatePlayer(DICE_STATE.ROLLING)

        setTimeout(
          () => setDiceStateEnemy(DICE_STATE.ROLLING),
          100 + Math.random() * 200
        )
      }
    }

    // MOVEMENT (MOVEMENT PHASE ONLY)
    else if ([COMMAND.NORTH, COMMAND.SOUTH, COMMAND.EAST, COMMAND.WEST].includes(command)) {
      if (phase === GAME_PHASE.PLAYER_MOVEMENT) {
        const
          level_data = useStateGame.getState().level,
          active_room = useStatePlayer.getState().room

        let
          adjacent_room = null,
          move_to_next_level = false

        if (command === COMMAND.NORTH) {
          if (active_room.doors.N) {
            adjacent_room = active_room.adjacent_blocks.find(block => block.direction === DIRECTION.N)

            if (!adjacent_room && active_room.index === level_data.room_end.index && active_room.level_door && active_room.level_door === DIRECTION.N) {
              move_to_next_level = true
            }
          }
        }

        else if (command === COMMAND.SOUTH) {
          if (active_room.doors.S) {
            adjacent_room = active_room.adjacent_blocks.find(block => block.direction === DIRECTION.S)

            if (!adjacent_room && active_room.index === level_data.room_end.index && active_room.level_door && active_room.level_door === DIRECTION.S) {
              move_to_next_level = true
            }
          }
        }

        else if (command === COMMAND.EAST) {
          if (active_room.doors.E) {
            adjacent_room = active_room.adjacent_blocks.find(block => block.direction === DIRECTION.E)

            if (!adjacent_room && active_room.index === level_data.room_end.index && active_room.level_door && active_room.level_door === DIRECTION.E) {
              move_to_next_level = true
            }
          }
        }

        else if (command === COMMAND.WEST) {
          if (active_room.doors.W) {
            adjacent_room = active_room.adjacent_blocks.find(block => block.direction === DIRECTION.W)

            if (!adjacent_room && active_room.index === level_data.room_end.index && active_room.level_door && active_room.level_door === DIRECTION.W) {
              move_to_next_level = true
            }
          }
        }

        if (adjacent_room) {
          // CHECK IF THE NEXT ROOM IS THE END/BOSS ROOM
          if (adjacent_room.index === level_data.room_end.index) {
            const player_has_key = useStatePlayer.getState().key

            if (!level_data.rooms[adjacent_room.index].locked || player_has_key) {
              setLog('ENTERING THE BOSS ROOM...')

              useKey()
              const new_active_room = level_data.rooms[adjacent_room.index]
              new_active_room.visited = true
              new_active_room.locked = false
              setRoom(new_active_room)
              setGamePhase(GAME_PHASE.ROOM_HIDING) // SceneContent.jsx useEffect[] SHOULD COORDINATE THIS ANIMATION
            }
            else {
              setLog('YOU NEED A KEY...')
            }
          }
          else {
            setLog('MOVING TO THE NEXT ROOM...')

            const new_active_room = level_data.rooms[adjacent_room.index]
            new_active_room.visited = true
            setRoom(new_active_room)
            setGamePhase(GAME_PHASE.ROOM_HIDING) // SceneContent.jsx useEffect[] SHOULD COORDINATE THIS ANIMATION
          }
        }
        else if (move_to_next_level) {
          setLog('MOVING TO THE NEXT LEVEL...')

          let floor_index = useStatePlayer.getState().floor_index
          floor_index++

          const level_data = generateLevel(
            floor_index,

            {
              index: active_room.index,
              level_door: active_room.level_door
            }
          )

          const new_active_room = level_data.rooms[level_data.room_start.index]
          new_active_room.visited = true

          setLevel(level_data)
          setFloorIndex(floor_index)
          setRoom(new_active_room)
          setGamePhase(GAME_PHASE.ROOM_HIDING)
        }

        setCommand(null)
      }
    }
  }

  useEffect(() => {
    // SET ORBIT CONTROLS REFERENCE TO BE ACCESSIBLE GLOBALY
    setControls(ref_orbit_controls.current)

    // -- START GAME ON MOUNT --
    // NEED TO USE setTimeout HERE TO EXECUTE ASYNCHRONOUSLY,
    // OTHERWISE THE SUBSCRIBERS WILL NOT BE READY AND THE CALLBACKS WILL NOT EXECUTE
    setTimeout(() => {
      setGamePhase(GAME_PHASE.TITLE_SHOWING)
    }, 500)

    // GAME PHASE SUBSCRIPTION (ZUSTAND)
    const subscribe_game_phase = useStateGame.subscribe(
      // SELECTOR
      state => state.phase,

      // CALLBACK
      phase_subscribed => {
        if (phase_subscribed === GAME_PHASE.GAME_START) {
          // INITIALIZE LEVEL
          const level_data = generateLevel(1)
          const active_room = level_data.rooms[level_data.room_start.index]
          active_room.visited = true

          setLevel(level_data)
          setFloorIndex(level_data.floor_number)
          setRoom(active_room)
          setGamePhase(GAME_PHASE.HUD_SHOWING)
          setLog('THE ADVENTURE BEGINS...')
          setRenderTitleScreen(false)
        }
      }
    )

    // GAME COMMANDS SUBSCRIPTION (ZUSTAND)
    const subscribe_game_command = useStateGame.subscribe(
      // SELECTOR
      state => state.command,

      // CALLBACK
      command_subscribed => processCommand(command_subscribed)
    )

    // KEYBOARD SUBSCRIPTION
    // - ROUTE COMMANDS TO ZUSTAND, THEN 'subscribe_game_command' ABOVE TO PROCESS
    const subscribe_keyboard = keyboard_subscribe(
      key => {
        const
          phase = useStateGame.getState().phase,
          previous_command = useStateGame.getState().command

        if (phase === GAME_PHASE.PLAYER_MOVEMENT || phase === GAME_PHASE.PLAYER_COMBAT) {
          if (key.NORTH && previous_command !== COMMAND.NORTH) {
            setCommand(COMMAND.NORTH)
          }
          else if (key.SOUTH && previous_command !== COMMAND.SOUTH) {
            setCommand(COMMAND.SOUTH)
          }
          else if (key.EAST && previous_command !== COMMAND.EAST) {
            setCommand(COMMAND.EAST)
          }
          else if (key.WEST && previous_command !== COMMAND.WEST) {
            setCommand(COMMAND.WEST)
          }
          else if (key.ROLL_DICE && previous_command !== COMMAND.ROLL_DICE) {
            setCommand(COMMAND.ROLL_DICE)
          }
          else if (key.POTION && previous_command !== COMMAND.POTION) {
            setCommand(COMMAND.POTION)
          }
        }
      }
    )

    // CLEANUP
    return () => {
      subscribe_game_phase()
      subscribe_game_command()
      subscribe_keyboard()
    }
  }, [])

  return <>
    {Perf && <Perf position='top-left' />}

    <OrbitControls
      ref={ref_orbit_controls}
      target={CAMERA_DEFAULTS.look_at}

      onChange={() => {
        if (!debug_enabled) return

        setControlsCamera({
          pos_x: camera.position.x,
          pos_y: camera.position.y,
          pos_z: camera.position.z,
          look_at_x: ref_orbit_controls.current.target.x,
          look_at_y: ref_orbit_controls.current.target.y,
          look_at_z: ref_orbit_controls.current.target.z
        })
      }}
    />

    <Environment files={FILES.ENVIRONMENT_SUNSET} />

    <color
      attach='background'
      args={['#6c323d']}
    />

    <directionalLight
      ref={ref_directional_light}
      castShadow={controls_lighting.shadow_enabled}

      position={[
        controls_lighting.directional_pos_x,
        controls_lighting.directional_pos_y,
        controls_lighting.directional_pos_z
      ]}

      intensity={controls_lighting.directional_intensity}
      color={controls_lighting.directional_color}
      shadow-mapSize={LIGHTING_DEFAULTS.shadow_map_size}
    >
      <orthographicCamera
        ref={ref_shadow_camera}
        attach='shadow-camera'
        near={controls_lighting.shadow_near}
        far={controls_lighting.shadow_far}

        args={[
          controls_lighting.shadow_left,
          controls_lighting.shadow_right,
          controls_lighting.shadow_top,
          controls_lighting.shadow_bottom,
        ]}
      />
    </directionalLight>

    <ambientLight
      intensity={controls_lighting.ambient_intensity}
      color={controls_lighting.ambient_color}
    />

    {/* 2D ELEMENTS */}
    <ScreenOverlay />

    {/* 3D SCENE */}
    <SceneContent />
  </>
}

export default Experience