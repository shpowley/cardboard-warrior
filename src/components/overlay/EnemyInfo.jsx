import { memo, useRef, useEffect } from 'react'
import { Image, Text } from '@react-three/drei'
import { useControls } from 'leva'

import { ANIMATION_STATE, useStateAnimation } from '../../stores/useStateAnimation'
import { useStatePlayer } from '../../stores/useStatePlayer'
import { useStateEnemy } from '../../stores/useStateEnemy'
import { useStateGame } from '../../stores/useStateGame'
import { FILES, LEVA_SORT_ORDER } from '../../common/Constants'
import HUDImages from '../../common/HUDImages'

const EnemyInfo = ({ forward_ref, aspect_ratio = 1, material_text }) => {
  const ref_enemy = {
    label: useRef(),
    health: useRef(),
    attack: useRef()
  }

  const
    setLog = useStateGame(state => state.setLog),
    setMonsterHealth = useStateEnemy(state => state.setHealth)

  // LEVA DEBUG ENEMY STATE
  const controls_enemy = useControls(
    'enemy info',
    {
      position_x: {
        label: 'position-x',
        value: 0.407,
        min: -1,
        max: 1,
        step: 0.01
      }
    },

    { collapsed: true, order: LEVA_SORT_ORDER.ENEMY }
  )

  useEffect(() => {
    // GAME PHASE SUBSCRIPTION (ZUSTAND)
    const subscribe_monster_animation = useStateAnimation.subscribe(
      // SELECTOR
      state => state.monster_sign_animation_state,

      // CALLBACK
      animation_state => {
        if (animation_state === ANIMATION_STATE.ANIMATING_TO_VISIBLE) {
          const monster = useStatePlayer.getState().room.monster

          if (monster) {
            setLog('PREPARE FOR COMBAT!')
            setMonsterHealth(monster.health)

            ref_enemy.label.current.text = monster.label
            ref_enemy.attack.current.text = monster.attack
          }
        }
      }
    )

    // MONSTER HEALTH SUBSCRIPTION (ZUSTAND)
    const subscribe_monster_health = useStateEnemy.subscribe(
      // SELECTOR
      state => state.health,

      // CALLBACK
      health => {
        ref_enemy.health.current.text = health
      }
    )

    // CLEANUP
    return () => {
      subscribe_monster_animation()
      subscribe_monster_health()
    }
  }, [])

  return <group
    ref={forward_ref}
    position={[controls_enemy.position_x * aspect_ratio, 0.39, 0]}
    scale={0.021}
    anchorX='right'
    anchorY='top'
    visible={false}
    dispose={null}
  >
    {/* MONSTER NAME */}
    <Text
      ref={ref_enemy.label}
      font={FILES.FONT_BEBAS_NEUE}
      material={material_text}
      anchorX='right'
      text='ENEMY: -'
    />

    {/* MONSTER HEALTH */}
    <group
      position={[-0.7, -1.4, 0]}
      anchorX='right'
    >
      <Image
        url={HUDImages.HEART.path}
        scale={HUDImages.HEART.scale}
        toneMapped={false}
        transparent
      />
      <Text
        ref={ref_enemy.health}
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        position={[-0.8, -0.01, 0]}
        anchorX='right'
        text='-'
      />
    </group>

    {/* MONSTER ATTACK */}
    <group
      position={[-0.7, -2.8, 0]}
      anchorX='right'
    >
      <Image
        url={HUDImages.SWORD.path}
        scale={HUDImages.SWORD.scale}
        toneMapped={false}
        transparent
      />
      <Text
        ref={ref_enemy.attack}
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        position={[-0.8, -0.01, 0]}
        anchorX='right'
        text='-'
      />
    </group>
  </group>
}

export default memo(EnemyInfo)