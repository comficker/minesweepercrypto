import type { AvailableRouterMethod, NitroFetchRequest } from 'nitropack'
import type { FetchError } from 'ofetch'
import type { Ref } from 'vue'
import type { FetchResult } from '#app/composables/fetch'
import { useFetch, useRuntimeConfig } from '#app'
import type { KeysOf } from '#app/composables/asyncData'

export function useAuthFetch<ResT = void,
  ErrorT = FetchError,
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  Method extends AvailableRouterMethod<ReqT> = 'get' extends AvailableRouterMethod<ReqT> ? 'get' : any,
  _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT, DataT = _ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>>(request: Ref<ReqT> | ReqT | (() => ReqT), opts?: any): any {
  const config = useRuntimeConfig()
  const route = useRoute()
  const authCookie = useCookie('auth.token', {
    sameSite: true
  })
  const token = route.query.token || authCookie.value
  if (!opts)
    opts = {}

  const headers: any = opts.headers || {}
  if (token)
    headers.Authorization = `Bearer ${token}`

  headers['Content-Type'] = 'application/json'
  headers.Accept = 'application/json; indent=4'
  opts.headers = headers
  return useFetch<ResT, ErrorT, ReqT, Method, _ResT, PickKeys>(request, {
    method: opts?.method,
    baseURL: config.public.apiBase,
    body: opts?.body,
    headers: opts.headers,
    query: opts?.query,
    params: opts?.params,
  }).then(async (res) => {
    if (res.pending.value)
      await res.execute()

    return res
  })
}
