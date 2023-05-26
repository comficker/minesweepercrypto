import {ref} from "vue"
import {defineStore} from 'pinia'

import {Setting} from "~/interface";
import {useCookie, useRoute} from "#app";


export const useGlobalStore = defineStore('global', () => {
  const cookieFormSize = useCookie('form.size')
  const route = useRoute()
  const arr = cookieFormSize.value ? cookieFormSize.value.split("_") : ['6', '6']

  const isTelegram = ref(!!route.query.token)
  const setting = ref<Setting>({
    soundOn: true,
    size: {
      width: Number.parseInt(arr[0]),
      height: Number.parseInt(arr[1])
    },
    refresh: true
  })

  const setSetting = (stt: Setting, ignoreForced = true) => {
    setting.value = {
      ...setting.value,
      ...stt
    }
    cookieFormSize.value = `${stt.size.width}_${stt.size.height}`
    if (ignoreForced) {
      setting.value.refresh = !setting.value.refresh
    }
  }

  return {
    setting,
    setSetting,
    isTelegram
  }
})

