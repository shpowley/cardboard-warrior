import { memo, useEffect, useRef } from 'react'
import { Image, Text } from '@react-three/drei'
import { button, useControls } from 'leva'

import { PLAYER_DEFAULTS, useStatePlayer } from '../../stores/useStatePlayer'
import { FILES, LEVA_SORT_ORDER } from '../../common/Constants'
import HUDImages from '../../common/HUDImages'

const PlayerInfo = ({ forward_ref, aspect_ratio = 1, material_text }) => {
  const ref_player = {
    health: useRef(),
    potions: useRef(),
    gold: useRef(),
    key: useRef()
  }

  // ZUSTAND GAME STATE
  const
    takePotion = useStatePlayer(state => state.takePotion),
    takeDamage = useStatePlayer(state => state.takeDamage),
    addGold = useStatePlayer(state => state.addGold),
    getKey = useStatePlayer(state => state.getKey),
    useKey = useStatePlayer(state => state.useKey)

  // LEVA DEBUG PLAYER STATE
  const controls_player = useControls(
    'player info',

    {
      position_x: {
        label: 'position-x',
        value: -0.407,
        min: -1,
        max: 1,
        step: 0.01
      },

      'take potion': button(() => {
        takePotion()
      }),

      'take damage': button(() => {
        takeDamage(1 + Math.floor(Math.random() * 4))
      }),

      'add gold': button(() => {
        addGold(1 + Math.floor(Math.random() * 100))
      }),

      'get key': button(() => {
        getKey()
      }),

      'use key': button(() => {
        useKey()
      })
    },

    { collapsed: true, order: LEVA_SORT_ORDER.PLAYER }
  )

  useEffect(() => {

    // INITIAL VISIBILITY
    forward_ref.current.traverse(child => {
      if (child.isMesh) {
        child.material.opacity = 0
      }
    })

    forward_ref.current.visible = true

    // PLAYER STATE SUBSCRIPTIONS (ZUSTAND)
    const subscribe_health = useStatePlayer.subscribe(
      // SELECTOR
      state => state.health,

      // CALLBACK
      health_subscribed => {
        ref_player.health.current.text = health_subscribed
      }
    )

    const subscribe_potions = useStatePlayer.subscribe(
      // SELECTOR
      state => state.potions,

      // CALLBACK
      potions_subscribed => {
        ref_player.potions.current.text = potions_subscribed
      }
    )

    const subscribe_gold = useStatePlayer.subscribe(
      // SELECTOR
      state => state.gold,

      // CALLBACK
      gold_subscribed => {
        ref_player.gold.current.text = gold_subscribed
      }
    )

    const subscribe_key = useStatePlayer.subscribe(
      // SELECTOR
      state => state.key,

      // CALLBACK
      key_subscribed => {
        ref_player.key.current.visible = key_subscribed
      }
    )

    // CLEANUP
    return () => {
      subscribe_health()
      subscribe_potions()
      subscribe_gold()
      subscribe_key()
    }
  }, [])

  return <group
    ref={forward_ref}
    position={[controls_player.position_x * aspect_ratio, 0.39, 0]}
    scale={0.021}
    anchorX='left'
    anchorY='top'
    opacity={0}
    visible={false}
    dispose={null}
  >
    {/* TITLE */}
    <Text
      font={FILES.FONT_BEBAS_NEUE}
      material={material_text}
      anchorX='left'
      text='CARDBOARD WARRIOR'
    />

    {/* HEALTH */}
    <group position={[0.7, -1.4, 0]}>
      <Image
        url={HUDImages.HEART.path}
        scale={HUDImages.HEART.scale}
        toneMapped={false}
        transparent
      />
      <Text
        ref={ref_player.health}
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        position={[0.8, -0.1, 0]}
        anchorX='left'
        text={PLAYER_DEFAULTS.health}
      />
    </group>

    {/* ATTACK */}
    <group position={[0.7, -2.8, 0]}>
      <Image
        url={HUDImages.SWORD.path}
        scale={HUDImages.SWORD.scale}
        toneMapped={false}
        transparent
      />
      <Text
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        position={[0.8, -0.1, 0]}
        anchorX='left'
        text={PLAYER_DEFAULTS.attack}
      />
    </group>

    {/* POTIONS */}
    <group position={[1, -4.2, 0]}>
      <Image
        url={HUDImages.POTIONS.path}
        scale={HUDImages.POTIONS.scale}
        toneMapped={false}
        transparent
      />
      <Text
        ref={ref_player.potions}
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        position={[0.9, -0.1, 0]}
        anchorX='left'
        text={PLAYER_DEFAULTS.potions}
      />
    </group>

    {/* GOLD */}
    <group position={[1.02, -5.6, 0]}>
      <Image
        url={HUDImages.COINS.path}
        scale={HUDImages.COINS.scale}
        toneMapped={false}
        transparent
      />
      <Text
        ref={ref_player.gold}
        font={FILES.FONT_BEBAS_NEUE}
        material={material_text}
        position={[1, -0.05, 0]}
        anchorX='left'
        text={PLAYER_DEFAULTS.gold}
      />
    </group>

    {/* KEY */}
    <Image
      ref={ref_player.key}
      url={HUDImages.KEY.path}
      scale={HUDImages.KEY.scale}
      position={[1.1, -7, 0]}
      toneMapped={false}
      transparent
      visible={PLAYER_DEFAULTS.key}
    />
  </group >
}

export default memo(PlayerInfo)