export default defineNuxtPlugin((nuxtApp) => {
  window.SOUND_TAP = new window.Audio("/sound/tap.wav")
  window.SOUND_OVER = new window.Audio("/sound/over.wav")
});
