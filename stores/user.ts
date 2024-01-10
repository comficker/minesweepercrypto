import {computed, ref} from "vue"
import {defineStore} from 'pinia'
import {User} from "~/interface";

export const useUserStore = defineStore('user', () => {

  const logged = ref<User>({} as User)

  const isLogged = computed(() => {
    return Boolean(logged.value && logged.value.id)
  })

  function setLogged(user: User) {
    logged.value = user
  }

  const balance = computed(() => logged.value?.meta?.game_minesweeper?.GMS || 0)
  const fetchBalance = async () => {
    const {data: res} = await useAuthFetch('/gms/balance')
    if (res.value != null) {
      logged.value.meta = {'game_minesweeper': {'GMS': res.value}}
    }
  }
  return {
    logged,
    setLogged,
    isLogged,
    balance,
    fetchBalance
  }
})

