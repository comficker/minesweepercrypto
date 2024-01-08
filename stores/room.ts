import {defineStore} from 'pinia'
import {useUserStore} from "~/stores/user";
import {useAuthFetch} from "~/composables/useAuthFetch";
import type {Room, Options, PlayMessage, Member, MemberRequestMessage} from "~/interface/gms";
import * as minesweeper from "~/helpers/minesweeper"
import {SAMPLE_ROOM} from "~/constants";
import {io} from "socket.io-client";
import {useRouter} from "#app";
import {SymbolKind} from "vscode-languageserver-types";
import Number = SymbolKind.Number;


export const useRoomStore = defineStore('room', () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()
  const router = useRouter()
  const data = ref<Room>(SAMPLE_ROOM)
  const options = ref<Options>({
    width: 9, height: 9, is_flagging: false, is_multiplayer: false, ticket: 0,
    num_bomb: Math.floor(9 * 9 * 0.2)
  })

  const currentPlayerIndex = computed<number>(() => {
    if (userStore.isLogged) {
      return data.value.gms_members.map(x => x.user?.id).indexOf(userStore.logged.id)
    }
    return 0
  })

  const currentPlayer = computed<Member>(() => {
    return data.value.gms_members[currentPlayerIndex.value]
  })

  const bombOpened = computed(() => {
    return Object.values(data.value.results || {}).filter(x => [-1, null].includes(x)).length
  })

  const isEnded = computed(() => ['won', 'dead', 'ended'].includes(data.value.status))
  const isPreview = computed(() => ['replaying', 'review'].includes(data.value.status))
  const joinStatus = computed(() => {
    if (isEnded.value) return 'ended'
    if (data.value.status !== 'waiting' || !data.value.is_multiplayer) return 'watching'
    if (currentPlayerIndex.value >= 0 && userStore.isLogged) {
      if (currentPlayer.value.status === 'pending') return 'requested'
      return 'joined'
    } else {
      return 'join'
    }
  })
  const isCreator = computed(() => {
    return userStore.isLogged && data.value.user == userStore.logged.id
  })
  const makeGame = async function (force_create: boolean = false, id: string | undefined = undefined) {
    if (userStore.isLogged || id) {
      const {data: res} = await useAuthFetch<Room>(`/gms/room`, {
        method: 'POST',
        body: {
          ...options.value,
          force_create,
          id
        },
        immediate: true,
        lazy: false
      })
      if (res.value) {
        if (force_create) {
          await router.push(`/room/${res.value.id}`)
        }
        onNewRoom(res.value)
      }
    } else {
      onNewRoom(minesweeper.createRoom(options.value))
    }
  }

  const play = async function (x: number, y: number, isPurchased: boolean = false, e: any = undefined) {
    if (e) e.preventDefault()
    if (isEnded.value || isPreview.value) return
    const payload = {
      id: data.value.id,
      x,
      y,
      is_purchased: isPurchased,
      is_flagging: e ? true : options.value.is_flagging
    }
    if (userStore.isLogged) {
      await useAuthFetch(`/gms/play`, {
        method: 'POST',
        body: payload,
        immediate: true
      })
    } else if (data.value.id === 0) {
      onPlayMessage(minesweeper.play(data.value, options.value, x, y))
    }
  }

  const setting = function (value: Options) {
    options.value = value
  }

  const purchase = async (is_purchase: boolean) => {
    await play(0, 0, is_purchase)
  }

  const onNewRoom = function (room: Room) {
    data.value = {
      ...room,
      results: room.results || {},
      maps: room.maps || {},
      start_at: new Date(room.start_at).getTime(),
      end_at: room.end_at ? new Date(room.end_at).getTime() : 0
    }
  }

  const onPlayMessage = function (message: PlayMessage) {
    console.log("onPlayMessage:", message);
    data.value.results = message.results
    data.value.turns.unshift(message.current)

    const index = data.value.gms_members.map(x => x.id).indexOf(message.current.id)
    if (index >= 0) {
      data.value.gms_members[index].status = message.current.status
      data.value.gms_members[index].score = message.current.score
      data.value.gms_members[index].timer = message.current.timer

    }

    const indexN = data.value.gms_members.map(x => x.id).indexOf(message.next.id)
    if (indexN >= 0) {
      data.value.gms_members[indexN].status = message.next.status
      data.value.gms_members[indexN].mark_time = message.next.mark_time
    }

    data.value.status = message.status
    if (["won", "dead", "ended"].includes(data.value.status)) {
      data.value.gms_members.forEach(member => {
        if (['waiting', 'playing'].includes(member.status) || member.status.startsWith("hold")) {
          member.status = data.value.status
        }
      })
    }
    if (message.start_at) {
      data.value.start_at = message.start_at
    }
    if (message.end_at) {
      data.value.end_at = message.end_at
    }
  }

  const onMemberRequestMessage = (message: MemberRequestMessage) => {
    console.log("onMemberRequestMessage:", message);
    if (message.room == data.value.id) {
      const index = data.value.gms_members.map(x => x.id).indexOf(message.member.id)
      if (index >= 0) {
        if (message.member.status == 'deleted') data.value.gms_members.splice(index, 1)
        else data.value.gms_members[index] = message.member
      } else {
        data.value.gms_members.push(message.member)
      }
    }
  }

  const changeStatus = (status: string) => {
    data.value.status = status
  }

  const connectSocket = (n: number, o: number | undefined = 0) => {
    if (!window.socket) {
      window.socket = io(config.public.socket);
      window.socket.connect()
    }
    if (o) {
      window.socket.removeAllListeners(`gms_${o}_play`);
      window.socket.removeAllListeners(`gms_${o}_member`);
    }
    window.socket.removeAllListeners(`gms_${n}_play`);
    window.socket.removeAllListeners(`gms_${n}_member`);
    window.socket.on(`gms_${n}_play`, onPlayMessage);
    window.socket.on(`gms_${n}_member`, onMemberRequestMessage);
  }

  watch(() => data.value.id, (n, o) => {
    connectSocket(n, o)
  })

  watch(() => userStore.logged.id, async () => {
    if (userStore.logged.id) await makeGame()
  })

  return {
    data, makeGame, play, setting, options, currentPlayer, isEnded, purchase, changeStatus, joinStatus, isCreator, bombOpened
  }
})

