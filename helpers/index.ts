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
