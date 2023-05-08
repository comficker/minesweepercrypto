import {ref} from "vue"
import {defineStore} from 'pinia'

import {Setting} from "~/interface";

export const useGlobalStore = defineStore('global', () => {
  const setting = ref<Setting>({
    size: {
      width: 9,
      height: 9
    }
  })

  const setSetting = (stt: Setting) => {
    setting.value = stt
  }
  return {
    setting,
    setSetting
  }
})

