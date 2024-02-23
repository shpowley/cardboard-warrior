import { useEffect } from 'react'
import { button, useControls } from 'leva'

import { useStateGame } from '../../../stores/useStateGame'
import { useStatePlayer } from '../../../stores/useStatePlayer'
import { useStateEnemy } from '../../../stores/useStateEnemy'
import { DICE_STATE, useStateDice } from '../../../stores/useStateDice'
import { ANIMATION_STATE, useStateAnimation } from '../../../stores/useStateAnimation'
import { LEVA_SORT_ORDER } from '../../../common/Constants'
import D20Enemy from './D20Enemy'
import D20 from './D20'

const Dice = () => {
  const
    setDiceStateCombined = useStateDice(state => state.setDiceStateCombined),
    setDiceStatePlayer = useStateDice(state => state.setDiceStatePlayer),
    setDiceStateEnemy = useStateDice(state => state.setDiceStateEnemy),
    setDiceAnimationState = useStateAnimation(state => state.setDiceAnimationState),
    setMonsterHealth = useStateEnemy(state => state.setHealth),
    playerTakeDamage = useStatePlayer(state => state.takeDamage),
    setCommand = useStateGame(state => state.setCommand),
    setLog = useStateGame(state => state.setLog)

  useControls(
    'dice rolling',

    {
      'roll d20 (player)': button(() => {
        setDiceStatePlayer(DICE_STATE.ROLLING)
      }),

      'roll d20 (enemy)': button(() => {
        setDiceStateEnemy(DICE_STATE.ROLLING)
      })
    },

    {
      collapsed: true,
      order: LEVA_SORT_ORDER.DICE_ROLL
    }
  )

  // BOTH DICE FINISHED ROLLING
  const diceRollsComplete = () => {
    const
      dice_roll_player = useStateDice.getState().dice_value_player,
      dice_roll_monster = useStateDice.getState().dice_value_enemy

    let log_text

    // --- TIE (NO DAMAGE - ROLL AGAIN) ---
    if (dice_roll_player === dice_roll_monster) {
      log_text = 'TIE! ROLL AGAIN.'
    }

    else {
      const
        active_room = useStatePlayer.getState().room,
        monster_data = active_room.monster,

        player = {
          attack: useStatePlayer.getState().attack,
          health: useStatePlayer.getState().health,
          max_health: useStatePlayer.getState().max_health
        },

        monster = {
          name: monster_data.label,
          attack: monster_data.attack,
          health: monster_data.health,
          max_health: monster_data.max_health
        }

      let
        attack = 0,
        damage = 0

      // --- PLAYER WINS ---
      if (dice_roll_player > dice_roll_monster) {
        log_text = `PLAYER ROLLS ${dice_roll_player}`

        // -- CRITICAL HIT?
        if (dice_roll_player === 20) {
          log_text += ' ..A CRITICAL HIT!'
          attack = player.attack * 2
        }
        else {
          attack = player.attack
        }

        // -- CALCULATE DAMAGE
        if (dice_roll_monster === 1) {
          log_text += '\nDEFENSE CRITICAL FAILURE ..MAX DAMAGE!'
          damage = attack // DEFENSE CRITICAL FAIL
        }
        else {
          damage = Math.ceil(
            (((dice_roll_player - dice_roll_monster) + 1) / 20) // DICE DIFFERENCE
            * attack                                            // USE BASE ATTACK OR CRITICAL HIT
            * (player.health / player.max_health)               // HEALTH MODIFIER
          )
        }

        // -- APPLY DAMAGE
        log_text += `\n${monster.name} TAKES ${damage} DAMAGE!`
        monster.health -= damage

        if (monster.health <= 0) {
          monster.health = 0
          log_text += `\n${monster.name} DEFEATED!`
        }

        monster_data.health = monster.health
        setMonsterHealth(monster.health)


        const level_data = useStateGame.getState().level
        console.log('ACTIVE_ROOM', active_room)
        console.log('LEVEL_DATA', level_data)
      }

      // --- MONSTER WINS ---
      else {
        log_text = `${monster.name} ROLLS ${dice_roll_monster}`

        // -- CRITICAL HIT?
        if (dice_roll_monster === 20) {
          log_text += ' ..A CRITICAL HIT!'
          attack = monster.attack * 2
        }
        else {
          attack = monster.attack
        }

        // -- CALCULATE DAMAGE
        if (dice_roll_player === 1) {
          log_text += '\nDEFENSE CRITICAL FAILURE ..MAX DAMAGE!'
          damage = attack // DEFENSE CRITICAL FAIL
        }
        else {
          damage = Math.ceil(
            (((dice_roll_monster - dice_roll_player) + 1) / 20) // DICE DIFFERENCE
            * attack                                            // USE BASE ATTACK OR CRITICAL HIT
            * (monster.health / monster.max_health)             // HEALTH MODIFIER
          )
        }

        // -- APPLY DAMAGE
        log_text += `\nPLAYER TAKES ${damage} DAMAGE!`
        playerTakeDamage(damage)
        player.health -= damage

        if (player.health <= 0) {
          player.health = 0
          log_text += '\nOH NOES!! PLAYER DEFEATED!'
        }
      }
    }

    // -- MESSAGE LOG
    setLog(log_text)

    setDiceStateCombined(DICE_STATE.ROLL_COMPLETE)
    setCommand(null) // NECESSARY TO RESET COMMANDS TO NULL BEFORE SETTING NEW COMMANDS
  }

  useEffect(() => {
    // DICE ROLL SUBSCRIPTION (ZUSTAND)
    const
      subscribePlayerDiceRollComplete = useStateDice.subscribe(
        // SELECTOR
        state => state.dice_state_player,

        // CALLBACK
        dice_state => {
          if (dice_state === DICE_STATE.ROLL_COMPLETE) {
            const dice_state_enemy = useStateDice.getState().dice_state_enemy

            if (dice_state_enemy === DICE_STATE.ROLL_COMPLETE) {
              diceRollsComplete()
            }
          }
          else if (dice_state === DICE_STATE.FALL_COMPLETE && useStateDice.getState().dice_state_enemy === DICE_STATE.FALL_COMPLETE) {
            setDiceAnimationState(ANIMATION_STATE.VISIBLE) // A BIT COMPLEX ..BOTH DICE NEED TO HAVE FALLEN BEFORE ANIMATION STATE CAN BE SET. REPEATED BELOW.
          }
          else if (dice_state === DICE_STATE.HIDE_COMPLETE && useStateDice.getState().dice_state_enemy === DICE_STATE.HIDE_COMPLETE) {
            setDiceAnimationState(ANIMATION_STATE.HIDDEN)
          }
        }
      ),

      subscribeEnemyDiceRollComplete = useStateDice.subscribe(
        // SELECTOR
        state => state.dice_state_enemy,

        // CALLBACK
        dice_state => {
          if (dice_state === DICE_STATE.ROLL_COMPLETE) {
            const dice_state_player = useStateDice.getState().dice_state_player

            if (dice_state_player === DICE_STATE.ROLL_COMPLETE) {
              diceRollsComplete()
            }
          }
          else if (dice_state === DICE_STATE.FALL_COMPLETE && useStateDice.getState().dice_state_player === DICE_STATE.FALL_COMPLETE) {
            setDiceAnimationState(ANIMATION_STATE.VISIBLE)
          }
          else if (dice_state === DICE_STATE.HIDE_COMPLETE && useStateDice.getState().dice_state_player === DICE_STATE.HIDE_COMPLETE) {
            setDiceAnimationState(ANIMATION_STATE.HIDDEN)
          }
        }
      )

    // CLEANUP
    return () => {
      subscribePlayerDiceRollComplete()
      subscribeEnemyDiceRollComplete()
    }
  }, [])

  return <group dispose={null}>
    <D20 castShadow />
    <D20Enemy castShadow />
  </group>
}

export default Dice