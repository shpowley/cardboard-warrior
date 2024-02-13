import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useEnemy = create(
  subscribeWithSelector(
    set => ({
      /** PROPERTIES */
      image_data: null,

      /** METHODS */
      setImageData: image_data => set({ image_data })
    })
  )
)

export { useEnemy }