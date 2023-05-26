import {IStep, IUserGame} from "~/interface";

const calculateDistance = (start: number, end: number) => {
  const distance = end - start
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return {
    days, hours, minutes, seconds
  }
}

export const countDownTimer = (start: number, end: number) => {
  const fm = function (num: number) {
    if (num >= 10) return num;
    return `0${num}`
  }
  let {days, hours, minutes, seconds} = calculateDistance(start, end)
  if (minutes < 0) minutes = 0;
  if (seconds < 0) seconds = 0;
  let cd = `${fm(minutes)}:${fm(seconds)}`
  if (hours > 0) {
    cd = `${fm(hours)}:${cd}`
  }
  if (days > 0) {
    cd = `${fm(days)}:${cd}`
  }
  return cd
}

export const timeSince = (d: string) => {
  const {days, hours, minutes} = calculateDistance(new Date(d).getTime(), new Date().getTime())
  if (!days && !hours && !minutes) {
    return 'a few seconds'
  }
  if (days) return `${days} days`
  if (hours) return `${hours} hours`
  if (minutes) return `${minutes} minutes`
}

export const getNeighbors = (x: number, y: number) => {
  return [[x, y - 1], [x, y + 1], [x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]];
}

export const randomCord = (maps: any, size: {width: number, height: number}, ignoreCord: string): string => {
  const x = Math.floor(Math.random() * size.width)
  const y = Math.floor(Math.random() * size.height)
  const key = `${x}_${y}`
  if (key !== ignoreCord && maps[key] !== -1) {
    return key
  } else {
    return randomCord(maps, size, ignoreCord)
  }
}

export const drawMapLocal = (size: {width: number, height: number}, ignoreCord: string):any => {
  const maps:any = {}
  const totalBomb = size.width * size.height
  while (Object.keys(maps).length < totalBomb) {
    maps[randomCord(maps, size, ignoreCord)] = -1
    console.log(maps);
  }
  Object.keys(maps).forEach((key: string) => {
    const cord = key.split("_")
    const neighbors = getNeighbors(Number.parseInt(cord[0]), Number.parseInt(cord[1]))
    neighbors.forEach((nb: number[]) => {
      if (nb[0] >= 0 && nb[1] >= 0) {
        const nbKey = `${nb[0]}_${nb[1]}`
        if (maps.value[nbKey] !== -1) {
          if (typeof maps[nbKey] === "undefined") {
            maps[nbKey] = 0
          }
          maps[nbKey]++
        }
      }
    })
  })
  return maps
}

export const getSteps = (resPlayers: IUserGame[]) => {
  let temp_steps: IStep[] = []
  resPlayers.forEach(p => {
    temp_steps = temp_steps.concat(p.steps)
  })
  return temp_steps.map(x => ({
    ...x,
    time: Math.round(x.time * 1000)
  })).sort((a, b) => a.time - b.time)
}
