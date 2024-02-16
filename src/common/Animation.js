import anime from 'animejs'
import { POSITIONS } from './Positions'

/** ANIME.JS - ANIMATIONS */
const

  /** ANIMATION - SHOW TITLE SCREEN */
  animateTitleShow = ({ target_title, target_new_game, target_github }) => {
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
        targets: [target_new_game, target_github],
        opacity: 1,
        duration: 400,
        easing: 'easeInSine'
      },

      500
    )

    return timeline
  },

  /** ANIMATION - HIDE TITLE SCREEN */
  animateTitleHide = ({ target_title, target_new_game, target_github }) => {
    const timeline = anime.timeline()

    timeline.add(
      {
        targets: [target_new_game, target_github],
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

  /** ANIMATION - HUD ELEMENTS */
  animateHUDShow = ({ target_controls, target_player, target_minimap, target_log }) => {
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
  },

  /** ANIMATION - SHOW ROOM */
  animateRoomShow = ({ target_walls, delay = 0 }) => {
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

    return timeline
  },

  /** ANIMATION - HIDE ROOM */
  animateRoomHide = ({ target_walls, delay = 0 }) => {
    const timeline = anime.timeline()

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

  /** ANIMATION - SHOW PLAYER */
  animatePlayerShow = ({ target_player, delay = 0 }) => {
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

  /** ANIMATION - HIDE PLAYER */
  animatePlayerHide = ({ target_player, delay = 0 }) => {
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

  /** ANIMATION - SHOW MONSTER SIGN */
  animateSignShow = ({ target_sign, delay = 0 }) => {
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

  /** ANIMATION - HIDE MONSTER SIGN */
  animateSignHide = ({ target_sign, delay = 0 }) => {
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
  }

const ANIMATIONS = {
  animateHUDShow,
  animatePlayerHide,
  animatePlayerShow,
  animateRoomHide,
  animateRoomShow,
  animateSignHide,
  animateSignShow,
  animateTitleHide,
  animateTitleShow,
}


export default ANIMATIONS