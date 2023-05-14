<template>
  <div class="uppercase font-bold">Membership</div>
  <p class="text-gray-400">Game on, together!</p>
  <div class="space-y-3 mt-3">
    <div
      v-if="mode === 'register'"
      class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1"
    >
      <div class="w-5 h-5 i-icons-at"/>
      <input
        v-model="form.email"
        type="email" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
        placeholder="Email">
    </div>
    <div
      class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1"
    >
      <div class="w-5 h-5 i-icons-account"/>
      <input
        v-model="form.username"
        type="text" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
        placeholder="Username">
    </div>
    <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
      <div class="w-5 h-5 i-icons-key"/>
      <input
        v-model="form.password"
        type="password" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
        placeholder="Password">
    </div>
    <div class="cursor-pointer bg-emerald-900 font-bold px-4 text-center text-white rounded py-2" @click="submit">
      <span v-if="mode === 'login'">Signin</span>
      <span v-else-if="mode === 'register'">Signup</span>
    </div>
    <div class="flex gap-4 uppercase text-xs font-bold">
      <div class="underline cursor-pointer" @click="swap">{{ mode === 'login' ? 'Register' : 'Login' }}</div>
      <div v-if="false" class="underline">Reset Password</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import {useAuthFetch} from "~/composables/useAuthFetch";
import {ResponseLogin} from "~/interface";
import {useUserStore} from "~/composables/user";

const userStore = useUserStore()
const mode = ref('login')
const form = ref({
  username: null,
  email: null,
  password: null
})

const submit = () => {
  const path = mode.value === 'login' ? '/auth/token' : '/auth/user'
  useAuthFetch(path, {
    method: 'POST',
    body: form.value
  }).then(res => {
    if (res.data.value) {
      const data = res.data.value as ResponseLogin
      userStore.setToken(data.access)
      userStore.setModal(null)
    }
    if (mode.value !== 'login' && window.gtag) {
      window.gtag('event', 'conversion', {'send_to': 'AW-987081603/rGqwCMby2Z8YEIPX1tYD'});
    }
  })
}

const swap = () => {
  if (mode.value === 'register') {
    mode.value = 'login'
  } else {
    mode.value = 'register'
  }
}
</script>
