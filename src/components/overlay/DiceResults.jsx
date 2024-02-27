import { memo, useEffect, useRef } from 'react'
import { Image, Text } from '@react-three/drei'

import { ANIMATION_STATE, useStateAnimation } from '../../stores/useStateAnimation'
import { DICE_STATE, useStateDice } from '../../stores/useStateDice'
import HUDImages from '../../common/HUDImages'
import { FILES } from '../../common/Constants'
import ANIMATIONS from '../../common/Animation'

const DiceResults = ({ forward_ref, aspect_ratio = 1, material_text }) => {
  const ref_dice = {
    text_player: useRef(),
    text_enemy: useRef()
  }

  // ANIMATIONS (anime.js)
  const animation = useRef()

  useEffect(() => {
    // DICE VISIBILITY SUBSCRIPTION (ZUSTAND)
    const subscribe_dice_visibility = useStateAnimation.subscribe(
      // SELECTOR
      state => state.dice_animation_state,

      // CALLBACK
      dice_animation_state => {
        if (dice_animation_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
          ref_dice.text_player.current.text = '-'
          ref_dice.text_enemy.current.text = '-'
          forward_ref.current.visible = true

          animation.current = ANIMATIONS.dice_results.show({
            target_dice: forward_ref.current
          })
        }
        else if (dice_animation_state === ANIMATION_STATE.HIDDEN) {
          animation.current = ANIMATIONS.dice_results.hide({
            target_dice: forward_ref.current
          })

          animation.current.complete = () => {
            forward_ref.current.visible = false
          }
        }
      }
    )

    // PLAYER DICE ROLL SUBSCRIPTION (ZUSTAND)
    const subscribe_dice_roll_player = useStateDice.subscribe(
      // SELECTOR
      state => state.dice_state_player,

      // CALLBACK
      dice_state_player => {
        if (dice_state_player === DICE_STATE.ROLLING) {
          ref_dice.text_player.current.text = '-'
        }
        else if (dice_state_player === DICE_STATE.ROLL_COMPLETE) {
          ref_dice.text_player.current.text = useStateDice.getState().dice_value_player
        }
      }
    )

    // ENEMY DICE ROLL SUBSCRIPTION (ZUSTAND)
    const subscribe_dice_roll_enemy = useStateDice.subscribe(
      // SELECTOR
      state => state.dice_state_enemy,

      // CALLBACK
      dice_state_enemy => {
        if (dice_state_enemy === DICE_STATE.ROLLING) {
          ref_dice.text_enemy.current.text = '-'
        }
        else if (dice_state_enemy === DICE_STATE.ROLL_COMPLETE) {
          ref_dice.text_enemy.current.text = useStateDice.getState().dice_value_enemy
        }
      }
    )

    // CLEANUP
    return () => {
      subscribe_dice_visibility()
      subscribe_dice_roll_player()
      subscribe_dice_roll_enemy()
    }
  }, [])

  return <group
    ref={forward_ref}
    visible={false}
    opacity={0}
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
        opacity={0}
      />
      <Text
        ref={ref_dice.text_player}
        position={[0, -2.4, 0]}
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        scale={1.5}
        text='-'
        opacity={0}
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
        opacity={0}
      />
      <Text
        ref={ref_dice.text_enemy}
        position={[0, -2.4, 0]}
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        scale={1.5}
        text='-'
        opacity={0}
      />
    </group>
  </group>
}

export default memo(DiceResults)