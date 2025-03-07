import { Image, useTexture } from '@react-three/drei'
import { memo, useCallback, useEffect, useRef } from 'react'

import { COMMAND } from '../../common/Constants'
import HUDImages from '../../common/HUDImages'
import { POSITIONS } from '../../common/Positions'
import { mouse_pointer } from '../../common/Utils'
import { DICE_STATE, useStateDice } from '../../stores/useStateDice'
import { GAME_PHASE, useStateGame } from '../../stores/useStateGame'
import { useStatePlayer } from '../../stores/useStatePlayer'

const KEYS = {
  DISABLED: {
    north: false,
    south: false,
    east: false,
    west: false,
    roll: false,
    potion: false
  }
}

const HUDKeys = ({ forward_ref }) => {
  const refs = {
    north: useRef(),
    south: useRef(),
    east: useRef(),
    west: useRef(),
    roll: useRef(),
    potion: useRef()
  }

  const key_state = useRef({
    north: false,
    south: false,
    east: false,
    west: false,
    roll: false,
    potion: false
  })

  const textures = {
    north: {
      enabled: useTexture(HUDImages.KEY_NORTH.path),
      disabled: useTexture(HUDImages.DISABLED_KEY_NORTH.path)
    },

    south: {
      enabled: useTexture(HUDImages.KEY_SOUTH.path),
      disabled: useTexture(HUDImages.DISABLED_KEY_SOUTH.path)
    },

    east: {
      enabled: useTexture(HUDImages.KEY_EAST.path),
      disabled: useTexture(HUDImages.DISABLED_KEY_EAST.path)
    },

    west: {
      enabled: useTexture(HUDImages.KEY_WEST.path),
      disabled: useTexture(HUDImages.DISABLED_KEY_WEST.path)
    },

    roll: {
      enabled: useTexture(HUDImages.KEY_ROLL.path),
      disabled: useTexture(HUDImages.DISABLED_ROLL.path)
    },

    potion: {
      enabled: useTexture(HUDImages.KEY_POTION.path),
      disabled: useTexture(HUDImages.KEY_POTION.path)
    }
  }

  const setKeys = useCallback(data => {
    key_state.current = {...data}

    refs.north.current.material.map = key_state.current.north ? textures.north.enabled : textures.north.disabled
    refs.south.current.material.map = key_state.current.south ? textures.south.enabled : textures.south.disabled
    refs.east.current.material.map = key_state.current.east ? textures.east.enabled : textures.east.disabled
    refs.west.current.material.map = key_state.current.west ? textures.west.enabled : textures.west.disabled
    refs.roll.current.material.map = key_state.current.roll ? textures.roll.enabled : textures.roll.disabled
    refs.potion.current.material.map = key_state.current.potion ? textures.potion.enabled : textures.potion.disabled
  } , [])

  const setCommand = useStateGame(state => state.setCommand)

  useEffect(() => {
    // SUBSCRIBE TO GAME PHASE
    const subscribe_game_phase = useStateGame.subscribe(
      // SELECTOR
      state => state.phase,

      // CALLBACK
      phase_subscribed => {
        let potion_count

        switch (phase_subscribed) {
          // COMBAT ONLY KEYS (ROLL, POTION)
          case GAME_PHASE.PLAYER_COMBAT:
            potion_count = useStatePlayer.getState().potions

            setKeys({
              ...KEYS.DISABLED,
              roll: true,
              potion: potion_count > 0
            })

            break

          // MOVEMENT-RELATED KEYS (NORTH, SOUTH, EAST, WEST + POTION)
          case GAME_PHASE.PLAYER_MOVEMENT:
            const active_room = useStatePlayer.getState().room
            potion_count = useStatePlayer.getState().potions

            setKeys({
              north: active_room.doors.N,
              south: active_room.doors.S,
              east: active_room.doors.E,
              west: active_room.doors.W,
              roll: false,
              potion: potion_count > 0
            })

            break

          // MOVEMENT-RELATED KEYS (NORTH, SOUTH, EAST, WEST + POTION) -- DISABLED
          case GAME_PHASE.ROOM_HIDING:
          case GAME_PHASE.ROOM_SHOWING:
          case GAME_PHASE.MONSTER_DEFEATED:
            setKeys(KEYS.DISABLED)
            break

          // MAKE SURE KEYS ARE NOT VISIBLE
          default:
            setKeys(KEYS.DISABLED)
            forward_ref.current.position.y = POSITIONS.KEYS.y.hidden
        }
      }
    )

    // SUBSCRIBE TO DICE ROLLING STATE (ENABLES/DISABLES DICE-ROLLING KEY)
    const subscribe_dice_rolling_state = useStateDice.subscribe(
      // SELECTOR
      state => state.dice_state_combined,

      // CALLBACK
      dice_state_combined => {
        if (dice_state_combined === DICE_STATE.ROLLING) {
          setKeys(KEYS.DISABLED)
        }
        else if (dice_state_combined === DICE_STATE.ROLL_COMPLETE) {
          const potion_count = useStatePlayer.getState().potions

          setKeys({
            ...KEYS.DISABLED,
            roll: true,
            potion: potion_count > 0
          })
        }
      }
    )

    // SUBSCRIBE TO PLAYER POTIONS COUNT (ENABLES/DISABLES POTION KEY)
    const subscribe_player_potions = useStatePlayer.subscribe(
      // SELECTOR
      state => state.potions,

      // CALLBACK
      potions => {
        setKeys({
          ...key_state.current,
          potion: potions > 0
        })
      }
    )

    // CLEAN UP
    return () => {
      subscribe_game_phase()
      subscribe_dice_rolling_state()
      subscribe_player_potions()
    }
  }, [])

  return <group
    ref={forward_ref}
    position={[POSITIONS.KEYS.x, POSITIONS.KEYS.y.hidden, 0]}
    scale={0.04}
    dispose={null}
  >
    {/* NORTH KEY */}
    <Image
      ref={refs.north}
      url={key_state.current.north ? HUDImages.KEY_NORTH.path : HUDImages.DISABLED_KEY_NORTH.path}
      transparent
      toneMapped={false}
      position={[0, 1.2, 0]}

      onPointerOver={key_state.current.north && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_state.current.north && setCommand(COMMAND.NORTH)}
    />

    {/* SOUTH KEY */}
    <Image
      ref={refs.south}
      url={key_state.current.south ? HUDImages.KEY_SOUTH.path : HUDImages.DISABLED_KEY_SOUTH.path}
      transparent
      toneMapped={false}
      position={[0, 0, 0]}

      onPointerOver={key_state.current.south && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_state.current.south && setCommand(COMMAND.SOUTH)}
    />

    {/* EAST KEY */}
    <Image
      ref={refs.east}
      url={key_state.current.east ? HUDImages.KEY_EAST.path : HUDImages.DISABLED_KEY_EAST.path}
      transparent
      toneMapped={false}
      position={[1.2, 0, 0]}

      onPointerOver={key_state.current.east && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_state.current.east && setCommand(COMMAND.EAST)}
    />

    {/* WEST KEY */}
    <Image
      ref={refs.west}
      url={key_state.current.west ? HUDImages.KEY_WEST.path : HUDImages.DISABLED_KEY_WEST.path}
      transparent
      toneMapped={false}
      position={[-1.2, 0, 0]}

      onPointerOver={key_state.current.west && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_state.current.west && setCommand(COMMAND.WEST)}
    />

    {/* ROLL KEY */}
    <Image
      ref={refs.roll}
      url={key_state.current.roll ? HUDImages.KEY_ROLL.path : HUDImages.DISABLED_ROLL.path}
      transparent
      toneMapped={false}
      position={[3.5, 0, 0]}
      scale={HUDImages.KEY_ROLL.scale}

      onPointerOver={key_state.current.roll && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_state.current.roll && setCommand(COMMAND.ROLL_DICE)}
    />

    {/* POTION KEY */}
    <Image
      ref={refs.potion}
      url={key_state.current.potion ? HUDImages.KEY_POTION.path : HUDImages.DISABLED_POTION.path}

      transparent
      toneMapped={false}
      position={[-2.5, 0, 0]}
      scale={HUDImages.KEY_POTION.scale}

      onPointerOver={key_state.current.potion && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_state.current.potion && setCommand(COMMAND.POTION)}
    />
  </group>
}

export default memo(HUDKeys)