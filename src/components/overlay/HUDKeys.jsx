import { memo, useEffect, useState } from 'react'
import { Image } from '@react-three/drei'

import { GAME_PHASE, useStateGame } from '../../stores/useStateGame'
import { useStatePlayer } from '../../stores/useStatePlayer'
import HUDImages from '../../common/HUDImages'
import { mouse_pointer } from '../../common/Utils'
import { POSITIONS } from '../../common/Positions'
import { COMMAND } from '../../common/Constants'
import { DICE_STATE, useStateDice } from '../../stores/useStateDice'

const KEYS = {
  DISABLED: {
    north: false,
    south: false,
    east: false,
    west: false,
    roll: false,
    potion: false
  },

  ENABLED: {
    north: true,
    south: true,
    east: true,
    west: true,
    roll: true,
    potion: true
  }
}

const HUDKeys = ({ forward_ref }) => {
  const [key_enabled, setKeyEnabled] = useState(KEYS.DISABLED)

  const setCommand = useStateGame(state => state.setCommand)

  // SUBSCRIBE TO GAME PHASE
  useEffect(() => {
    // SUBSCRIBE TO room_animation_state + GAME PHASE
    const subscribeRoomAnimationState = useStateGame.subscribe(
      // SELECTOR
      state => state.phase,

      // CALLBACK
      phase_subscribed => {
        switch (phase_subscribed) {
          // COMBAT ONLY KEYS (ROLL, POTION)
          case GAME_PHASE.PLAYER_COMBAT:
            setKeyEnabled({ ...KEYS.DISABLED, roll: true, potion: true })
            break

          // MOVEMENT-RELATED KEYS (NORTH, SOUTH, EAST, WEST + POTION)
          case GAME_PHASE.PLAYER_MOVEMENT:
            const
              active_room = useStatePlayer.getState().room,
              potions = useStatePlayer.getState().potions

            setKeyEnabled({
              north: active_room.doors.N,
              south: active_room.doors.S,
              east: active_room.doors.E,
              west: active_room.doors.W,
              roll: false,
              potion: potions > 0
            })

            break

          // MOVEMENT-RELATED KEYS (NORTH, SOUTH, EAST, WEST + POTION) -- DISABLED
          case GAME_PHASE.ROOM_HIDING:
          case GAME_PHASE.ROOM_SHOWING:
          case GAME_PHASE.MONSTER_DEFEATED:
            setKeyEnabled(KEYS.DISABLED)
            break

          // MAKE SURE KEYS ARE NOT VISIBLE
          default:
            setKeyEnabled(KEYS.DISABLED)
            forward_ref.current.position.y = POSITIONS.KEYS.y.hidden
        }
      }
    )

    // SUBSCRIBE TO DICE ROLLING STATE (ENABLES/DISABLES DICE-ROLLING KEY)
    const subscribeDiceRollingState = useStateDice.subscribe(
      // SELECTOR
      state => state.dice_state_combined,

      // CALLBACK
      dice_state_combined => {
        if (dice_state_combined === DICE_STATE.ROLLING) {
          setKeyEnabled(prev_state => ({
            ...prev_state,
            roll: false
          }))
        }
        else if (dice_state_combined === DICE_STATE.ROLL_COMPLETE) {
          setKeyEnabled(prev_state => ({
            ...prev_state,
            roll: true
          }))
        }
      }
    )

    // CLEAN UP
    return () => {
      subscribeRoomAnimationState()
      subscribeDiceRollingState()
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
      url={key_enabled.north ? HUDImages.KEY_NORTH.path : HUDImages.DISABLED_KEY_NORTH.path}
      transparent
      toneMapped={false}
      position={[0, 1.2, 0]}

      onPointerOver={key_enabled.north && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_enabled.north && setCommand(COMMAND.NORTH)}
    />

    {/* SOUTH KEY */}
    <Image
      url={key_enabled.south ? HUDImages.KEY_SOUTH.path : HUDImages.DISABLED_KEY_SOUTH.path}
      transparent
      toneMapped={false}
      position={[0, 0, 0]}

      onPointerOver={key_enabled.south && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_enabled.south && setCommand(COMMAND.SOUTH)}
    />

    {/* EAST KEY */}
    <Image
      url={key_enabled.east ? HUDImages.KEY_EAST.path : HUDImages.DISABLED_KEY_EAST.path}
      transparent
      toneMapped={false}
      position={[1.2, 0, 0]}

      onPointerOver={key_enabled.east && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_enabled.east && setCommand(COMMAND.EAST)}
    />

    {/* WEST KEY */}
    <Image
      url={key_enabled.west ? HUDImages.KEY_WEST.path : HUDImages.DISABLED_KEY_WEST.path}
      transparent
      toneMapped={false}
      position={[-1.2, 0, 0]}

      onPointerOver={key_enabled.west && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_enabled.west && setCommand(COMMAND.WEST)}
    />

    {/* ROLL KEY */}
    <Image
      url={key_enabled.roll ? HUDImages.KEY_ROLL.path : HUDImages.DISABLED_ROLL.path}
      transparent
      toneMapped={false}
      position={[3.5, 0, 0]}
      scale={HUDImages.KEY_ROLL.scale}

      onPointerOver={key_enabled.roll && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_enabled.roll && setCommand(COMMAND.ROLL_DICE)}
    />

    {/* POTION KEY */}
    <Image
      url={key_enabled.potion ? HUDImages.KEY_POTION.path : HUDImages.DISABLED_POTION.path}
      transparent
      toneMapped={false}
      position={[-2.5, 0, 0]}
      scale={HUDImages.KEY_POTION.scale}

      onPointerOver={key_enabled.potion && mouse_pointer.over}
      onPointerOut={mouse_pointer.out}
      onClick={() => key_enabled.potion && setCommand(COMMAND.POTION)}
    />
  </group>
}

export default memo(HUDKeys)