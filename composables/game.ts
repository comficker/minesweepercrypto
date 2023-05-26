import {computed, ref} from "vue"
import {defineStore} from 'pinia'
import {IStep, IUserGame, User, IGame} from "~/interface";
import {getNeighbors, getSteps} from "~/helpers";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {useUserStore} from "~/composables/user";

export const useGameStore = defineStore('game', () => {
  const id = ref(0)
  const maps = ref<{ [key: string]: number | null | undefined }>({})
  const results = ref<{ [key: string]: number | null | undefined }>({})
  const status = ref('playing')
  const width = ref(9)
  const height = ref(9)
  const start_at = ref<number>(0)
  const end_at = ref<number>(0)
  const players = ref<IUserGame[]>([])

  const is_flagging = ref(false)

  const ending = ref(false)
  const steps = ref<IStep[]>([])
  const host = ref<User | null>(null)
  const playStatus = ref('playing')
  const playQueue = ref<any[]>([])

  const total_bomb = computed(() => {
    return Math.floor(width.value * height.value * 0.2)
  })
  const is_multiple = computed(() => {
    return false
  })

  const userStore = useUserStore()

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
      status.value = 'dead'
      results.value = maps.value
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
    }
  }

  async function playServer(e: Event | null, x: number | undefined, y: number | undefined, isPurchased = false): Promise<string | null> {
    if (e) e.preventDefault()
    const {data: res} = await useAuthFetch(`/minesweeper/play`, {
      method: 'POST',
      body: {
        id: id.value || undefined,
        x, y,
        is_purchased: isPurchased,
        is_flag: is_flagging.value || !!e,
        width: width.value,
        height: height.value
      },
      server: false
    })
    const value = res.value as any
    if (value) {
      transformData(value)
      return value.status
    }
    return null
  }

  const transformData = (value: IGame) => {
    if (value.id) id.value = value.id
    if (value.status) status.value = value.status;
    if (value.start_at) start_at.value = (new Date(value.start_at)).getTime();
    if (value.height && value.width) {
      height.value = value.height
      width.value = value.width
    }
    if (value.players) players.value = value.players
    if (value.user) host.value = value.user
    results.value = value.results || {}
    if (value.maps) {
      maps.value = value.maps
      if (status.value === 'dead') {
        results.value = value.maps
      }
    }
    steps.value = getSteps(value.players)
    if (userStore.isLogged) {
      const currentTurn = value.players.filter(x => x.user.id === userStore.logged.id)[0]
      if (currentTurn) {
        playStatus.value = currentTurn.status
      }
    }
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
    if (game) {
      transformData(game)
    } else if (userStore.isLogged) {
      id.value = 0
      await playServer(null, -1, -1, false).then()
    }
  }

  const newGame = () => {
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
      playServer(null, undefined, undefined, false).then()
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
      const s = await playServer(null, Number.parseInt(arr[1]), Number.parseInt(arr[2]), isPurchased)
      if (s && s?.startsWith("hold_")) {
        //TODO
      }
    }
  }

  return {
    id,
    maps,
    results,
    status,
    width,
    height,
    start_at,
    end_at,
    players,
    steps,
    is_flagging,
    is_multiple,
    total_bomb,
    host,
    playStatus,
    init,
    play,
    toggleFlag,
    newGame,
    replay,
    stopPlay,
    purchase
  }
})

