import anime from 'animejs'
import { POSITIONS } from './Positions'

/** ANIME.JS - ANIMATION TIMELINE */
const

  /** ANIMATION TIMELINE - SHOW TITLE SCREEN */
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

  /** ANIMATION TIMELINE - HIDE TITLE SCREEN */
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

  /** ANIMATION TIMELINE - GAME ELEMENTS */
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

  // REFERENCE CODE - REMOVE LATER
  /** ANIMATE A GROUP OF ELEMENTS
   *  targets: [elements]
   *  y: y-position
   *  duration: duration in ms
   *  timeline_offset: timeline offset in ms
   */
  animateTimeline = ({ targets, y, duration, timeline_offset = 0, autoplay = true }) => {
    if (!targets) return

    const timeline = anime.timeline({
      autoplay
    })

    const
      offset_min = duration * 0.1,
      offset_max = duration * 0.6

    Object.values(targets).forEach(
      (target, index) => {
        const animation_offset = index === 0
          ? 0
          : offset_min + Math.random() * (offset_max - offset_min)

        timeline.add(
          {
            targets: target.current.position,
            y,
            duration,
            easing: 'easeInOutSine',
            autoplay
          },

          animation_offset
        )
      },

      timeline_offset // timeline offset
    )

    return timeline
  }

const ANIMATIONS = {
  animateHUDShow,
  animateTimeline,
  animateTitleHide,
  animateTitleShow
}


export default ANIMATIONS