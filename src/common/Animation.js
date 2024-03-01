import anime from 'animejs'
import { POSITIONS } from './Positions'

/** ANIME.JS - ANIMATIONS
 *  https://animejs.com/documentation/
 *
 *  * NOTE THE update() CALLBACKS USED TO UPDATE MATERIAL OPACITY
 *    THIS WORKS QUITE WELL FOR "GROUPS" OF THREE.JS ELEMENTS
 */
const

  /** ANIMATION - TITLE SCREEN */
  title = {
    show: ({ target_title, target_new_game, target_sound, target_github }) => {
      const timeline = anime.timeline()

      timeline.add(
        {
          targets: target_title,
          y: POSITIONS.TITLE.y.visible,
          duration: 1000,
          easing: 'spring(0.8, 85, 9, 5)' // mass, stiffness, damping, velocity
        }
      )

      timeline.add(
        {
          targets: [target_new_game, target_sound, target_github],
          opacity: 1,
          duration: 400,
          easing: 'easeInSine'
        },

        500
      )

      return timeline
    },

    hide: ({ target_title, target_new_game, target_sound, target_github }) => {
      const timeline = anime.timeline()

      timeline.add(
        {
          targets: [target_new_game, target_sound, target_github],
          opacity: 0,
          duration: 1000,
          easing: 'easeOutSine'
        }
      )

      timeline.add(
        {
          targets: target_title,
          y: POSITIONS.TITLE.y.end,
          duration: 600,
          easing: 'easeInOutSine'
        },

        400
      )

      return timeline
    },
  },

  /** ANIMATION - HUD ELEMENTS */
  hud = {
    show: ({ target_controls, target_player, target_minimap, target_log }) => {
      const timeline = anime.timeline()

      // CONTROLS SLIDE UP
      timeline.add(
        {
          targets: target_controls,
          y: POSITIONS.KEYS.y.visible,
          duration: 2000
        }
      )

      // PLAYER INFO & MINIMAP FADE IN (GROUP OF ELEMENTS)
      timeline.add(
        {
          targets: [target_player, target_minimap, target_log],
          opacity: 1,
          duration: 3000,

          update: () => {
            target_player.traverse(child => {
              if (child.isMesh) {
                child.material.opacity = target_player.opacity
              }
            })

            target_minimap.traverse(child => {
              if (child.isMesh) {
                child.material.opacity = target_minimap.opacity
              }
            })
          }
        },

        600
      )

      return timeline
    }
  },

  /** ANIMATION - WALLS */
  walls = {
    show: ({ target_walls, target_arrows, delay = 0 }) => {
      const timeline = anime.timeline()

      timeline.add(
        {
          targets: [
            target_walls.north.wall.current.position,
            target_walls.south.wall.current.position,
            target_walls.east.wall.current.position,
            target_walls.west.wall.current.position
          ],

          y: POSITIONS.WALLS.y.visible,
          duration: 1000,
          delay: anime.stagger([0, 400]),
          easing: 'easeInOutSine'
        },

        delay
      )

      if (target_arrows) {
        timeline.add(
          {
            targets: target_arrows,
            opacity: 1,
            duration: 1000,
            easing: 'easeInSine'
          },

          1000
        )
      }

      return timeline
    },

    hide: ({ target_walls, target_arrows, delay = 0 }) => {
      const timeline = anime.timeline()

      if (target_arrows) {
        timeline.add(
          {
            targets: target_arrows,
            opacity: 0,
            duration: 1000,
            easing: 'easeOutSine'
          }
        )
      }

      timeline.add(
        {
          targets: [
            target_walls.north.wall.current.position,
            target_walls.south.wall.current.position,
            target_walls.east.wall.current.position,
            target_walls.west.wall.current.position
          ],

          y: POSITIONS.WALLS.y.hidden,
          duration: 1000,
          delay: anime.stagger([0, 400]),
          easing: 'easeInOutSine',

          complete: () => {
            target_walls.north.wall.current.visible = false
            target_walls.south.wall.current.visible = false
            target_walls.east.wall.current.visible = false
            target_walls.west.wall.current.visible = false
          }
        },

        delay
      )

      return timeline
    },
  },

  /** ANIMATION - PLAYER */
  player = {
    show: ({ target_player, delay = 0 }) => {
      const timeline = anime.timeline()

      target_player.current.visible = true

      timeline.add(
        {
          targets: target_player.current.position,
          y: POSITIONS.PLAYER.y.visible,
          duration: 1000,
          easing: 'easeInOutSine'
        },

        delay
      )

      return timeline
    },

    hide: ({ target_player, delay = 0 }) => {
      const timeline = anime.timeline()

      timeline.add(
        {
          targets: target_player.current.position,
          y: POSITIONS.PLAYER.y.hidden,
          duration: 1000,
          easing: 'easeInOutSine',
          complete: () => target_player.current.visible = false
        },

        delay
      )

      return timeline
    },
  },

  /** ANIMATION - MONSTER SIGN */
  monster_sign = {
    show: ({ target_sign, delay = 0 }) => {
      const timeline = anime.timeline()

      target_sign.current.visible = true

      timeline.add(
        {
          targets: target_sign.current.position,
          y: POSITIONS.MONSTER_SIGN.y.visible,
          duration: 1000,
          easing: 'spring(0.8, 60, 9, 3)'
        },

        delay
      )

      return timeline
    },

    hide: ({ target_sign, delay = 0 }) => {
      const timeline = anime.timeline()

      timeline.add(
        {
          targets: target_sign.current.position,
          y: POSITIONS.MONSTER_SIGN.y.hidden,
          duration: 500,
          easing: 'easeInOutSine',
          complete: () => target_sign.current.visible = false
        },

        delay
      )

      return timeline
    },
  },

  /** ANIMATION - DICE RESULTS */
  dice_results = {
    show: ({ target_dice, delay = 0 }) => {
      const animation = anime({
        targets: target_dice,
        opacity: 1,
        duration: 500,
        easing: 'easeInSine',
        delay,

        update: () => {
          target_dice.traverse(child => {
            if (child.isMesh) {
              child.material.opacity = target_dice.opacity
            }
          })
        }
      })

      return animation
    },

    /** ANIMATION - HIDE DICE RESULTS */
    hide: ({ target_dice, delay = 0 }) => {
      const animation = anime({
        targets: target_dice,
        opacity: 0,
        duration: 500,
        easing: 'easeOutSine',
        delay,

        update: () => {
          target_dice.traverse(child => {
            if (child.isMesh) {
              child.material.opacity = target_dice.opacity
            }
          })
        }
      })

      return animation
    }
  },

  /** ANIMATION - MINIMAP */
  minimap = {
    show: ({ target_minimap, delay = 0 }) => {
      const animation = anime({
        targets: target_minimap,
        opacity: 1,
        duration: 1000,
        easing: 'easeInSine',
        delay,

        update: () => {
          target_minimap.traverse(child => {
            if (child.isMesh) {
              child.material.opacity = target_minimap.opacity
            }
          })
        }
      })

      return animation
    },

    hide: ({ target_minimap, delay = 0 }) => {
      const animation = anime({
        targets: target_minimap,
        opacity: 0,
        duration: 1000,
        easing: 'easeOutSine',
        delay,

        update: () => {
          target_minimap.traverse(child => {
            if (child.isMesh) {
              child.material.opacity = target_minimap.opacity
            }
          })
        }
      })

      return animation
    }
  }

const ANIMATIONS = {
  title,
  hud,
  walls,
  player,
  monster_sign,
  dice_results,
  minimap
}

export default ANIMATIONS