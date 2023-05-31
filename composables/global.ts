import {ref} from "vue"
import {defineStore} from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const route = useRoute()

  const isTelegram = ref(!!route.query.token)

  return {
    isTelegram
  }
})

