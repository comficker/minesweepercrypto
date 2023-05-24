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
    <div v-if="errorStrings.length" class="p-3 bg-yellow-200 border text-sm">
      <ul class="pl-4 list-disc">
        <li v-for="item in errorStrings" :key="item">{{item}}</li>
      </ul>
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
import {computed, ref} from "vue"
import {useAuthFetch} from "~/composables/useAuthFetch";
import {ResponseLogin} from "~/interface";
import {useUserStore} from "~/composables/user";
import {useRoute} from "#app";

const ERROR_DICT: {[key: string]: string} = {
  EMAIL_BLANK: 'Email field cannot be left blank. Please enter a valid email address.',
  USERNAME_BLANK: 'Username field cannot be left blank.',
  PASSWORD_BLANK: 'Username field cannot be empty.',
  EMAIL_DUPLICATE: 'This email address is already registered.',
  USERNAME_DUPLICATE: 'This username is already registered.',
  PASSWORD_TOO_SHORT: 'Your password is too short, it must be more than 6 characters.'
}
const route = useRoute()
const userStore = useUserStore()
const mode = ref(userStore.modalOpening || 'login')
const form = ref({
  username: null,
  email: null,
  password: null,
  ref: route.query.ref
})
const errors = ref<string[]>([])

const errorStrings = computed(() => {
  return errors.value.map((x: string) => ERROR_DICT[x] || x)
})

const submit = () => {
  const path = mode.value === 'login' ? '/auth/token' : '/auth/user'
  errors.value = []
  useAuthFetch(path, {
    method: 'POST',
    body: form.value
  }).then(res => {
    if (res.data.value) {
      const data = res.data.value as ResponseLogin
      userStore.setToken(data.access)
      userStore.setModal(null)
      errors.value = []
    } else if (res.error.value) {
      if (Array.isArray(res.error.value.data)) {
        errors.value = res.error.value.data
      } else {
        if ('detail' in res.error.value.data) {
          errors.value.push(res.error.value.data.detail)
        }
      }
    }
    if (mode.value !== 'login' && window.dataLayer) {
      window.dataLayer.push('event', 'conversion', {'send_to': 'AW-987081603/rGqwCMby2Z8YEIPX1tYD'});
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
