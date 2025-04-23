<script setup lang="ts">
import { ref, useTemplateRef } from "vue";

declare var ymaps: any
const mapElement = useTemplateRef<any>('map')
let mapObject: any
const init = (): void => {

  mapObject = new ymaps.Map(mapElement.value, {
    // При инициализации карты обязательно нужно указать
    // её центр и коэффициент масштабирования.
    center: [55.76, 37.64], // Москва
    zoom: 10
  }, {
    searchControlProvider: 'yandex#search'
  });
}

ymaps.ready(init)
</script>

<template>
  <div id="map" ref="map" class="map-container h-full"></div>
</template>

<style scoped></style>
