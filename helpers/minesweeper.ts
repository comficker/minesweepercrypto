import {getNeighbors} from "~/helpers/index";
import type {Options, PlayMessage, Room, Turn} from "~/interface/gms";


interface MapResult {
  [key: string]: number
}

export function play(room: Room, options: Options, x: number, y: number, clicked: string[] = [], is_flagging = false): PlayMessage {
  let totalBomb = Object.keys(room.maps).length
  if (totalBomb === 0) {
    if (room.num_bomb === 0) room.num_bomb = Math.floor(room.height * room.width * 0.2)
    while (totalBomb < room.num_bomb) {
      const x1 = Math.floor(Math.random() * options.width)
      const y1 = Math.floor(Math.random() * options.height)
      const key = `${x1}_${y1}`
      if (key !== `${x}_${y}` && room.maps[key] !== -1) {
        room.maps[key] = -1
        totalBomb++
      }
    }
    Object.keys(room.maps).forEach((key: string) => {
      const [x, y] = key.split("_").map(x => Number.parseInt(x))
      const neighbors = getNeighbors(x, y, room.width, room.height)
      neighbors.forEach(([x, y]) => {
        const nbKey = `${x}_${y}`
        if (room.maps[nbKey] !== -1 && room.maps[nbKey] !== null) {
          if (typeof room.maps[nbKey] === "undefined") {
            room.maps[nbKey] = 0
          }
          // @ts-ignore
          room.maps[nbKey]++
        }
      })
    })
    room.start_at = new Date().getTime()
  }
  const results = room.results ? room.results : {}
  const cord = `${x}_${y}`
  let status = 'playing'
  if (is_flagging && typeof results[cord] !== "number") {
    if (typeof results[cord] == 'undefined') {
      results[cord] = null
    } else {
      delete results[cord]
    }
  } else {
    if (room.maps[cord] == -1) {
      Object.assign(results, room.maps)
      status = "dead"
    } else if (typeof room.maps[cord] === "undefined") {
      clicked.push(cord)
      results[cord] = 0
      const neighbors = getNeighbors(x, y, room.width, room.height)
      neighbors.forEach((nb: number[]) => {
        const key = `${nb[0]}_${nb[1]}`
        if (nb[0] >= 0 && nb[1] >= 0 && nb[0] < room.width && nb[1] < room.height && !clicked.includes(key)) {
          play(room, options, nb[0], nb[1], clicked)
        }
      })
    } else {
      results[cord] = room.maps[cord]
    }
  }

  const opened = Object.values(results).filter(x => x !== null).length
  if (room.width * room.height - opened === room.num_bomb) {
    status = 'won'
  }
  return {
    start_at: 0,
    room: 0,
    results,
    current: {
      id: 0,
      status: status,
      cord: cord,
      timer: 0,
      score: 0
    },
    next: {
      id: 0,
      mark_time: 0,
      status: status
    },
    status: status,
    end_at: ['dead', 'won'].includes(status) ? new Date().getTime() : 0
  }
}

export function createRoom(options: Options): Room {
  return {
    user: 0,
    id: 0,
    width: options.width,
    height: options.height,
    num_bomb: options.num_bomb,
    status: "waiting",
    is_multiplayer: false,
    ticket: 0,
    prize: 0,
    start_at: new Date().getTime(),
    end_at: 0,
    turns: [],
    gms_members: [{
      id: 0,
      user: {
        id: 0,
        username: "guess",
        first_name: "guess",
        last_name: "",
        meta: null
      },
      status: "waiting",
      score: 0,
      order: 1,
      timer: 0,
      mark_time: 0
    }],
    maps: {},
    results: {}
  }
}
