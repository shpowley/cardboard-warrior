import { memo, useEffect, useRef } from 'react'
import { Image, Text } from '@react-three/drei'

import { ANIMATION_STATE, useStateAnimation } from '../../stores/useStateAnimation'
import { DICE_STATE, useStateDice } from '../../stores/useStateDice'
import HUDImages from '../../common/HUDImages'
import { FILES } from '../../common/Constants'

const DiceResults = ({ forward_ref, aspect_ratio = 1, material_text }) => {
  const ref_text = {
    player: useRef(),
    enemy: useRef()
  }

  useEffect(() => {
    // DICE VISIBILITY SUBSCRIPTION (ZUSTAND)
    const subscribeDiceVisibility = useStateAnimation.subscribe(
      // SELECTOR
      state => state.dice_animation_state,

      // CALLBACK
      dice_animation_state => {
        if (dice_animation_state === ANIMATION_STATE.VISIBLE) {
          ref_text.player.current.text = '-'
          ref_text.enemy.current.text = '-'
          forward_ref.current.visible = true
        }
        else if (dice_animation_state === ANIMATION_STATE.ANIMATING_TO_HIDE) {
          forward_ref.current.visible = false
        }
      }
    )

    // PLAYER DICE ROLL SUBSCRIPTION (ZUSTAND)
    const subscribeDiceRollPlayer = useStateDice.subscribe(
      // SELECTOR
      state => state.dice_state_player,

      // CALLBACK
      dice_state_player => {
        if (dice_state_player === DICE_STATE.ROLLING) {
          ref_text.player.current.text = '-'
        }
        else if (dice_state_player === DICE_STATE.ROLL_COMPLETE) {
          ref_text.player.current.text = useStateDice.getState().dice_value_player
        }
      }
    )

    // ENEMY DICE ROLL SUBSCRIPTION (ZUSTAND)
    const subscribeDiceRollEnemy = useStateDice.subscribe(
      // SELECTOR
      state => state.dice_state_enemy,

      // CALLBACK
      dice_state_enemy => {
        if (dice_state_enemy === DICE_STATE.ROLLING) {
          ref_text.enemy.current.text = '-'
        }
        else if (dice_state_enemy === DICE_STATE.ROLL_COMPLETE) {
          ref_text.enemy.current.text = useStateDice.getState().dice_value_enemy
        }
      }
    )

    // CLEANUP
    return () => {
      subscribeDiceVisibility()
      subscribeDiceRollPlayer()
      subscribeDiceRollEnemy()
    }
  }, [])

  return <group
    ref={forward_ref}
    visible={false}
  >
    {/* PLAYER */}
    <group
      position={[-0.39 * aspect_ratio, 0.18, 0]}
      scale={0.021}
      anchorX='left'
    >
      <Image
        url={HUDImages.DICE_PLAYER.path}
        scale={HUDImages.DICE_PLAYER.scale}
        toneMapped={false}
        transparent
      />
      <Text
        ref={ref_text.player}
        position={[0, -2.4, 0]}
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        scale={1.5}
        text='-'
      />
    </group>

    {/* ENEMY */}
    <group
      position={[0.39 * aspect_ratio, 0.18, 0]}
      scale={0.021}
      anchorX='right'
    >
      <Image
        url={HUDImages.DICE_ENEMY.path}
        scale={HUDImages.DICE_ENEMY.scale}
        toneMapped={false}
        transparent
      />
      <Text
        ref={ref_text.enemy}
        position={[0, -2.4, 0]}
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        scale={1.5}
        text='-'
      />
    </group>
  </group>
}

export default memo(DiceResults)