import {useUserStore} from "~/composables/user";

export default defineNuxtPlugin(async nuxtApp => {
  const userStore = useUserStore()
  userStore.fetchUser()
})
