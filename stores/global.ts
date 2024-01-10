import {ref} from "vue"
import {defineStore} from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const route = useRoute()

  const isTelegram = ref(!!route.query.token)
  const modal = ref('')
  const setModal = (value: string) => {
    modal.value  = value
  }

  watch(() => route.fullPath, () => {
    setModal('')
  })
  return {
    isTelegram,
    modal,
    setModal
  }
})

