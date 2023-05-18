import {ref} from "vue"
import {defineStore} from 'pinia'

import {Setting} from "~/interface";
import {onMounted} from "@vue/runtime-core";
import {useCookie, useRoute} from "#app";


export const useGlobalStore = defineStore('global', () => {
  const cookieFormSize = useCookie('form.size')
  const route = useRoute()
  const arr = cookieFormSize.value ? cookieFormSize.value.split("_") : ['6', '6']

  const isTelegram = ref(!!route.query.token)
  const setting = ref<Setting>({
    size: {
      width: Number.parseInt(arr[0]),
      height: Number.parseInt(arr[1])
    }
  })

  const setSetting = (stt: Setting, ignoreForced = true) => {
    if (ignoreForced) {
      setting.value = stt
    } else {
      cookieFormSize.value = `${stt.size.width}_${stt.size.height}`
    }
  }

  return {
    setting,
    setSetting,
    isTelegram
  }
})

