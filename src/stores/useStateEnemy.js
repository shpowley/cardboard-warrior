import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useStateEnemy = create(
  subscribeWithSelector(
    set => ({
      /** PROPERTIES */
      health: 0,
      image_data: null,

      /** METHODS */
      setHealth: health => set({ health }),
      setImageData: image_data => set({ image_data })
    })
  )
)

export { useStateEnemy }