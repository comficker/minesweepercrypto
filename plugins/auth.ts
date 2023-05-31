import {useUserStore} from "~/composables/user";

export default defineNuxtPlugin( nuxtApp => {
  const userStore = useUserStore()
  userStore.fetchUser().then()
})
