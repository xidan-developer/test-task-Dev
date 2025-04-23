import { type App } from 'vue'
import { createYmaps, VueYandexMaps } from 'vue-yandex-maps'

const apikey: string = '06a773db-8075-433b-b6c9-a568d357743c'
const settings: VueYandexMaps.PluginSettings = {
  apikey,
  initializeOn: 'onPluginInit',
  version: '2.1'
}
const ymaps = createYmaps(settings)

export default {
  install: (app: App): void => {
    app.use(ymaps)
  }
}
