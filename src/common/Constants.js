import * as THREE from 'three'

const LEVA_SORT_ORDER = {
  TONE_MAPPING: 0,
  CAMERA: 1,
  LIGHTING: 2,
  ACTIONS: 3,
  PLAYER: 4,
  ENEMY: 5
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
  position: [1.7, 2.4, 5.9],
  look_at: [0, 1, 0],
  leva_min_max: 100
}

const LIGHTING_DEFAULTS = {
  ambient_intensity: 0.5,
  ambient_color: '#ffffff',

  directional_intensity: 1.0,
  directional_position: [1, 10, 1],
  directional_target: [0, 0, 0],
  directional_color: '#ffffff',
  leva_min_max: 100,

  shadow_near: 2,
  shadow_far: 11,
  shadow_map_size: [256, 256],
  shadow_left: -5,
  shadow_right: 5,
  shadow_top: 5,
  shadow_bottom: -5,
  shadow_color: '#000000',
  shadow_opacity: 0.2
}

const FILE_FONT_BEBAS_NEUE = './fonts/bebas-neue-v9-latin-regular.woff'

const LINK_GITHUB = 'https://github.com/shpowley/cardboard-warrior/blob/master/credits.txt'

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
  FILE_FONT_BEBAS_NEUE,
  LINK_GITHUB,
  ITEM_KEYS
}