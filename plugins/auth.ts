import {useUserStore} from "~/stores/user";
import {User} from "~/interface";
import {ofetch} from "ofetch";
import useStatefulCookie from "~/composables/useStatefulCookie";
import {createWeb3Auth, connect, Chain, account, signMessage} from '@kolirt/vue-web3-auth'
import {useGlobalStore} from "~/stores/global";

const oxa: Chain = {
  id: 20241,
  name: 'OXA Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OXA',
    symbol: 'OXA'
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.oxoa.games']
    },
    public: {
      http: ['https://testnet-rpc.oxoa.games']
    }
  },
  blockExplorers: {
    default: {
      name: 'Scan',
      url: 'https://testnet-blockscout.oxoa.games'
    }
  }
}
export default defineNuxtPlugin(async (NuxtApp) => {
  const config = useRuntimeConfig()
  if (process.client) {
    //@ts-ignore
    NuxtApp.vueApp.use(createWeb3Auth({
      projectId: config.public.connectWalletId,
      chains: [oxa]
    }))
  }
  const cookieToken = useStatefulCookie('auth.token')
  const cookieTokenRefresh = useStatefulCookie('auth.token_refresh')
  const userStore = useUserStore()
  const globalStore = useGlobalStore()
  const touch = ofetch.create({
    baseURL: config.public.apiBase,
    headers: {
      "Accept": 'application/json',
      "Content-Type": 'application/json'
    }
  })

  async function refreshToken() {
    const res = await touch('/auth/token/refresh', {
      method: 'POST',
      body: {
        refresh: cookieTokenRefresh.value
      }
    }).catch(() => null)
    if (res) {
      cookieToken.value = res.access
      return true
    }
    return false
  }

  async function fetchUser() {
    return await touch<User>('/auth/user', {
      headers: {
        "Authorization": `Bearer ${cookieToken.value}`
      }
    }).catch(() => null)
  }

  function clearToken() {
    cookieTokenRefresh.value = ''
    cookieToken.value = ''
  }

  async function authenticate() {
    if (userStore.logged.id) return null
    if (cookieToken.value) {
      let userRes = await fetchUser()
      if (!userRes && cookieTokenRefresh.value && await refreshToken()) {
        userRes = await fetchUser()
      }
      if (userRes) {
        userStore.setLogged(userRes)
        return userRes
      }
    }
    clearToken()
    return null
  }

  async function login(username: string, password: string) {
    let response = await touch<{ access: string, refresh: string } | null>('/auth/login', {
      method: "POST",
      body: {
        username,
        password
      }
    }).catch(() => null)
    if (response) {
      cookieTokenRefresh.value = response.refresh
      cookieToken.value = response.access
      userStore.setLogged(await fetchUser() || {} as User)
      await useRouter().push('/')
    }
  }

  async function register(username: string, password: string, email: string, ref: string) {
    let response = await touch<{ access: string, refresh: string } | null>('/auth/user', {
      method: "POST",
      body: {
        username,
        password,
        email,
        ref
      }
    }).catch(() => null)
    if (response) {

    }
  }

  async function forgot(email: string) {
    let response = await touch<{ access: string, refresh: string } | null>('/auth/forgot', {
      method: "POST",
      body: {
        email
      }
    }).catch(() => null)
    if (response) {

    }
  }

  async function logout() {
    await touch('/auth/logout', {
      method: "DELETE",
      headers: {"Authorization": `Bearer ${cookieToken.value}`}
    })
    cookieToken.value = ''
    cookieTokenRefresh.value = ''
    userStore.setLogged({} as User)
    await useRouter().push('/hello#bye')
  }

  async function connectWeb3() {
    await connect()
  }

  watch(() => account.connected, async () => {
    if (account.connected && !userStore.isLogged) {
      const signature = await signMessage('Hello Minesweeper').catch(() => null)
      if (!signature) return
      const {data: response} = await useAuthFetch<{ access: string, refresh: string } | null>('/auth/login-wallet', {
        method: "POST",
        body: {
          signature,
          address: account.address
        }
      })
      if (response.value) {
        cookieTokenRefresh.value = response.value.refresh
        cookieToken.value = response.value.access
        userStore.setLogged(await fetchUser() || {} as User)
        globalStore.setModal('')
        await useRouter().push('/')
      }
    }
  })

  return {
    provide: {
      authenticate,
      login,
      register,
      forgot,
      logout,
      connectWeb3
    }
  }
})
