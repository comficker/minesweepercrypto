import {IStep, IUserGame, type User} from "~/interface";

const calculateDistance = (distance: number) => {
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return {
    days, hours, minutes, seconds
  }
}

export const countDownTimer = (start: number, end: number, distance: number | undefined = undefined) => {
  const fm = function (num: number) {
    if (num >= 10) return num;
    return `0${num}`
  }
  let {days, hours, minutes, seconds} = calculateDistance(distance ? distance : end - start)
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

export const timeSince = (d: string | number) => {
  if (!d) return '_'
  const {days, hours, minutes} = calculateDistance(new Date().getTime() - new Date(d).getTime())
  if (!days && !hours && !minutes) {
    return 'a few seconds'
  }
  if (days) return `${days} days`
  if (hours) return `${hours} hours`
  if (minutes) return `${minutes} minutes`
}

export const getNeighbors = (x: number, y: number, width: number, height: number) => {
  return [[x, y - 1], [x, y + 1], [x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]].filter(([x, y])=> {
    return x < width && x >= 0 && y >= 0 && y < height
  })
}

export const getSteps = (resPlayers: IUserGame[]) => {
  let temp_steps: IStep[] = []
  resPlayers.forEach(p => {
    temp_steps = temp_steps.concat(p.steps.filter(x => !x.status || !x.status.startsWith('hold_')))
  })
  return temp_steps.map(x => ({
    ...x,
    time: Math.round(x.time * 1000)
  })).sort((a, b) => a.time - b.time)
}

export function fullName(user: User) {
  if (user.username.length === 42) {
    return `${user.username.substring(0, 5)}...${user.username.substring(37, 42)}`
  } else if (user.first_name || user.last_name) {
    return `${user.first_name} ${user.last_name}`
  }
  return user.username
}
