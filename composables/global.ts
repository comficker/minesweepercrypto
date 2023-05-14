import {ref} from "vue"
import {defineStore} from 'pinia'

import {Setting} from "~/interface";
import {onMounted} from "@vue/runtime-core";
import {useCookie} from "#app";


export const useGlobalStore = defineStore('global', () => {
  const cookieFormSize = useCookie('form.size')
  const arr = cookieFormSize.value ? cookieFormSize.value.split("_") : ['16', '16']
  const setting = ref<Setting>({
    size: {
      width: Number.parseInt(arr[0]),
      height: Number.parseInt(arr[1])
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

