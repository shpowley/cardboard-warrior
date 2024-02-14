import * as THREE from 'three'

const LEVA_SORT_ORDER = {
  TONE_MAPPING: 0,
  CAMERA: 1,
  LIGHTING: 2,
  ACTIONS: 3,
  PLAYER: 4,
  ENEMY: 5,
  MONSTER: 6,
  PHYSICS: 7,
  CONSTRUCTION_ANIMATIONS: 8,
  WARRIOR_ANIMATIONS: 9,
  DICE_ROLL: 10
}

const TONE_MAPPING_OPTIONS = {
  None: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
}

const CAMERA_DEFAULTS = {
  fov: 45,
  near: 0.5,
  far: 60,
  position: [0, 10, 16.5],
  look_at: [0, 0, 0],
  leva_min_max: 100
}

const LIGHTING_DEFAULTS = {
  ambient_intensity: 0.5,
  ambient_color: '#ff8c00',

  directional_intensity: 1.0,
  directional_position: [5, 12, 5],
  directional_target: [0, 0, 0],
  directional_color: '#dc3a3a',
  leva_min_max: 100,

  shadow_near: 1.5,
  shadow_far: 20,
  shadow_map_size: [256, 256],
  shadow_left: -12,
  shadow_right: 12,
  shadow_top: 12,
  shadow_bottom: -10,
  shadow_color: '#000000',
  shadow_opacity: 0.2
}

const FILES = {
  FONT_BEBAS_NEUE: './fonts/bebas-neue-v9-latin-regular.woff',
  D20_MODEL: './models/d20-compressed.glb',
  D20_ENEMY_MODEL: './models/d20-obsidian-compressed.glb',
  SOUND_HIT: './sounds/hit.mp3'
}

const LINKS = {
  GITHUB: 'https://github.com/shpowley/cardboard-warrior/blob/master/credits.txt'
}

const ITEM_KEYS = {
  HEALTH_POTION: 0,
  TREASURE_CHEST: 1,
  KEY: 2
}

export {
  TONE_MAPPING_OPTIONS,
  CAMERA_DEFAULTS,
  LIGHTING_DEFAULTS,
  LEVA_SORT_ORDER,
  FILES,
  LINKS,
  ITEM_KEYS
}