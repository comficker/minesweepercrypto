import {computed, ref} from "vue"
import {defineStore} from 'pinia'
import {IStep, IUserGame, User, IGame, ITurnMessage, Setting, PlayingTurn, MessageTurn} from "~/interface";
import {getNeighbors, getSteps} from "~/helpers";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {useUserStore} from "~/composables/user";
import {io} from "socket.io-client";
import {useCookie, useRuntimeConfig} from "#app";

export const useGameStore = defineStore('game', () => {
  const config = useRuntimeConfig()

  const cookieFormSize = useCookie('form.size', {
    sameSite: true
  })
  const arr = cookieFormSize.value ? cookieFormSize.value.split("_") : ['8', '10']

  const setting = ref<Setting>({
    width: Number.parseInt(arr[0]),
    height: Number.parseInt(arr[1]),
    is_multiple: false
  })

  const is_multiple = ref(false)
  const id = ref(0)
  const maps = ref<{ [key: string]: number | null | undefined }>({})
  const results = ref<{ [key: string]: number | null | undefined }>({})
  const status = ref('playing')
  const width = ref(Number.parseInt(arr[0]))
  const height = ref(Number.parseInt(arr[1]))
  const start_at = ref<number | null>(0)
  const end_at = ref<number>(0)
  const players = ref<IUserGame[]>([])

  const is_flagging = ref(false)

  const ending = ref(false)
  const steps = ref<IStep[]>([])
  const host = ref<User | null | undefined>(null)
  const playStatus = ref('playing')
  const playQueue = ref<any[]>([])
  const total_bomb = computed(() => {
    return Math.floor(width.value * height.value * 0.2)
  })
  const playingTurn = ref<PlayingTurn | null>(null)

  const userStore = useUserStore()

  function saveSetting(data: {
    width: number
    height: number
    is_multiple: boolean
  }) {
    setting.value = {
      ...data
    }
    newGame(true).then(() => userStore.setModal(null))
  }

  function toggleFlag() {
    is_flagging.value = !is_flagging.value
  }

  function randomCord(ignoreCord: string): void {
    const x = Math.floor(Math.random() * width.value)
    const y = Math.floor(Math.random() * height.value)
    const key = `${x}_${y}`
    if (key !== ignoreCord && maps.value[key] !== -1) {
      maps.value[key] = -1
      return
    } else {
      randomCord(ignoreCord)
    }
  }

  function localDrawMap(ignoreCord: string): any {
    while (Object.keys(maps.value).length < total_bomb.value) {
      randomCord(ignoreCord)
    }
    Object.keys(maps.value).forEach((key: string) => {
      const cord = key.split("_")
      const neighbors = getNeighbors(Number.parseInt(cord[0]), Number.parseInt(cord[1]))
      neighbors.forEach((nb: number[]) => {
        if (nb[0] >= 0 && nb[1] >= 0) {
          const nbKey = `${nb[0]}_${nb[1]}`
          if (maps.value[nbKey] !== -1 && maps.value[nbKey] !== null) {
            if (typeof maps.value[nbKey] === "undefined") {
              maps.value[nbKey] = 0
            }
            // @ts-ignore
            maps.value[nbKey]++
          }
        }
      })
    })
  }

  function localFlag(cord: string) {
    if (typeof results.value[cord] === 'undefined') {
      results.value[cord] = null
    } else {
      delete results.value[cord]
    }
  }

  function playLocal(e: Event | null, cord: string, clicked: string[] = [], isRecording = true) {
    if (e && e.preventDefault) e.preventDefault()
    if (Object.keys(maps.value).length === 0) {
      localDrawMap(cord)
      start_at.value = (new Date()).getTime()
    }
    if (clicked.length === 0 && isRecording) {
      steps.value.push({
        time: new Date().getTime(),
        cord: is_flagging.value || e ? cord + '_?' : cord,
        user: null
      })
    }
    if (is_flagging.value || e || results.value[cord] === null) {
      if (is_flagging.value || e)
        localFlag(cord)
      return;
    }
    const checked = maps.value[cord]
    results.value[cord] = checked
    if (checked === -1) {
      playStatus.value = 'dead'
      results.value = maps.value
      ending.value = true
      return;
    }

    if (typeof maps.value[cord] === "undefined") {
      clicked.push(cord)
      results.value[cord] = 0
      const nbCord = cord.split("_")
      const neighbors = getNeighbors(Number.parseInt(nbCord[0]), Number.parseInt(nbCord[1]))
      neighbors.forEach((nb: number[]) => {
        const key = `${nb[0]}_${nb[1]}`
        if (
          nb[0] >= 0 && nb[1] >= 0 &&
          nb[0] < width.value && nb[1] < height.value &&
          !clicked.includes(key)) {
          playLocal(null, key, clicked)
        }
      })
    }
    const opened = Object.values(results.value).filter(x => x !== null).length
    if (width.value * height.value - opened === total_bomb.value) {
      status.value = 'win'
      playStatus.value = 'win'
      ending.value = true
    }
  }

  async function playServer(e: Event | null, x: number, y: number, isPurchased = false) {
    if (e) e.preventDefault()
    await useAuthFetch(`/minesweeper/play`, {
      method: 'POST',
      body: {
        id: id.value,
        x,
        y,
        is_purchased: isPurchased,
        is_flag: is_flagging.value || !!e,
      },
      server: false
    })
  }

  const transformData = (value: IGame) => {
    if (value.id) id.value = value.id
    if (value.status) status.value = value.status;
    start_at.value = value.start_at ? (new Date(value.start_at)).getTime() : null;
    if (value.height && value.width) {
      height.value = value.height
      width.value = value.width
    }
    if (value.players) players.value = value.players
    if (value.user && value.players) host.value = value.players.filter(turn => value.user == turn.user.id)[0]?.user
    results.value = value.results || {}
    if (value.maps) {
      maps.value = value.maps
      if (status.value === 'dead') {
        results.value = value.maps
      }
    }
    is_multiple.value = value.is_multiple
    steps.value = getSteps(value.players)
    if (userStore.isLogged) {
      const currentTurn = value.players.filter(x => x.user.id === userStore.logged.id)[0]
      if (currentTurn) {
        playStatus.value = currentTurn.status
      }
    }
    setting.value.width = width.value
    setting.value.height = height.value
    setting.value.is_multiple = is_multiple.value
  }

  const play = (e: Event | null, x: number, y: number) => {
    if (status.value !== 'playing') return;
    if (typeof results.value[`${x}_${y}`] === "number" || (results.value[`${x}_${y}`] === null && !is_flagging.value && !e))
      return;
    if (userStore.isLogged) {
      playServer(e, x, y).then()
    } else {
      playLocal(e, `${x}_${y}`, [])
    }
  }

  const init = async (game: IGame | undefined) => {
    ending.value = false
    if (game) {
      transformData(game)
    } else if (userStore.isLogged) {
      id.value = 0
      await newGame(false)
    }
  }

  const newGame = async (is_force = true) => {
    ending.value = false
    id.value = 0
    start_at.value = new Date().getTime()
    status.value = 'playing'
    steps.value = []
    results.value = {}
    maps.value = {}
    playQueue.value.forEach(to => {
      clearTimeout(to)
    })
    if (userStore.isLogged) {
      const {data: res} = await useAuthFetch(`/minesweeper/my-game`, {
        method: 'POST',
        body: {
          force: is_force,
          ...setting.value
        },
        server: false
      })
      const value = res.value as any
      if (value) {
        transformData(value)
      }
    } else {
      width.value = setting.value.width
      height.value = setting.value.height
    }
  }

  const replay = () => {
    ending.value = false
    results.value = {}
    status.value = 'replaying'
    playQueue.value.forEach(to => {
      clearTimeout(to)
    })
    playQueue.value = []
    steps.value.forEach((step: IStep, i: number) => {
      playQueue.value.push(setTimeout(() => {
        let cord = step.cord
        is_flagging.value = false
        if (step.cord.endsWith("_?")) {
          is_flagging.value = true
          cord = step.cord.replace("_?", "")
        }
        playLocal(null, cord, [], false)
        if (i === steps.value.length - 1 && !id.value) {
          ending.value = true
        }
      }, i * 800))
    })
  }

  const stopPlay = () => {
    playQueue.value.forEach(to => {
      clearTimeout(to)
    })
    steps.value.forEach((step: IStep, i: number) => {
      let cord = step.cord
      is_flagging.value = false
      if (step.cord.endsWith("_?")) {
        is_flagging.value = true
        cord = step.cord.replace("_?", "")
      }
      playLocal(null, cord, [], false)
    })
  }

  const purchase = async (isPurchased = false) => {
    if (playStatus.value.startsWith("hold_")) {
      const arr = playStatus.value.split("_")
      await playServer(null, Number.parseInt(arr[1]), Number.parseInt(arr[2]), isPurchased)
    }
  }

  const onPlayReceived = (message: ITurnMessage) => {
    if (message.game === id.value) {
      if (!start_at.value)
        start_at.value = message.step.time * 1000
      results.value = message.results
      maps.value = message.maps || {}
      status.value = message.status
      steps.value.push(message.step)
      if (message.maps && message.status === 'dead') {
        results.value = message.maps
      }
      if (message.step && message.step.status != null) {
        playStatus.value = message.step.status
        if (['dead', 'win'].includes(playStatus.value))
          ending.value = true
      }
    }
  }

  const onTurnReceived = (message: MessageTurn) => {
    console.log(message);
    if (message.game == id.value) {
      if (message.playing) {

      } else {
        play(null, 0, 0)
      }
      playingTurn.value = message.playing
    }
  }

  const onRequestReceived = (message: ITurnMessage) => {
    console.log(message);
  }

  const connectSocket = (n: number, o: number | undefined = 0) => {
    if (!window.socket) {
      window.socket = io(config.public.socket);
      window.socket.connect()
    }
    if (o) {
      window.socket.removeAllListeners(`mb_${o}_play`);
      window.socket.removeAllListeners(`mb_${o}_turn`);
      window.socket.removeAllListeners(`mb_${o}_join`);
    }
    window.socket.removeAllListeners(`mb_${n}_play`);
    window.socket.removeAllListeners(`mb_${n}_turn`);
    window.socket.removeAllListeners(`mb_${n}_join`);
    window.socket.on(`mb_${n}_play`, onPlayReceived);
    window.socket.on(`mb_${n}_turn`, onTurnReceived);
    window.socket.on(`mb_${n}_join`, onRequestReceived);
  }

  watch(id, (n, o) => {
    connectSocket(n, o)
  })

  onMounted(() => {
    if (id.value)
      connectSocket(id.value)
  })

  return {
    id,
    maps,
    results,
    status,
    width,
    height,
    is_multiple,
    start_at,
    end_at,
    players,
    steps,
    is_flagging,
    total_bomb,
    host,
    playStatus,
    ending,
    setting,
    init,
    play,
    toggleFlag,
    newGame,
    replay,
    stopPlay,
    purchase,
    saveSetting
  }
})

