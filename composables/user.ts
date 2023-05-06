import {computed, ref} from "vue"
import {defineStore} from 'pinia'

import {User} from "~/interface";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {useCookie, useRoute} from "#app";

export const useUserStore = defineStore('user', () => {
  /**
   * Current named of the user.
   */
  const route = useRoute()
  const authCookie = useCookie('auth.token')

  const token = ref(route.query.token || authCookie.value)
  const logged = ref({} as User)
  const modalOpening = ref<null | string>(null)

  const isLogged = computed(() => {
    return Boolean(logged.value && logged.value.id)
  })

  function setToken(nToken: string) {
    authCookie.value = nToken
    token.value = nToken
    setTimeout(() => {
      fetchUser().then(() => console.log("LOGGED"))
    }, 800)
  }

  function setLogged(user: User) {
    logged.value = user
  }

  function setModal(value: string | null) {
    modalOpening.value = value
  }

  async function fetchUser() {
    if (token.value) {
      const {data: userRes} = await useAuthFetch<User>('/auth/user')
      setLogged(userRes.value as User)
    }
  }

  return {
    modalOpening,
    logged,
    setLogged,
    fetchUser,
    setToken,
    setModal,
    isLogged
  }
})

