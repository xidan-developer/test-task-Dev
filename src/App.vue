<script setup lang="ts">
import { type Ref, ref, useTemplateRef } from 'vue';
import usePolygonStore from '@/stores/polygonStore';
import { storeToRefs } from 'pinia';
import type { LngLat } from '@yandex/ymaps3-types';
import useClickStore from '@/stores/clickStore';

const polygonStore = usePolygonStore();
const { polygonCoords } = storeToRefs(polygonStore);

const clickStore = useClickStore();

declare let ymaps: any;

const mapElement = useTemplateRef<any>('map');
const showInfoBlock: Ref<boolean> = ref(false);
const distanceLine: Ref<string> = ref('');
const distanceAuto: Ref<string> = ref('');
const addressMark: Ref<string> = ref('');

let mapObject: any;

const findClosestPoint = (clickCoords: number[], polygon: LngLat[][]): LngLat[] => {
  let closestPoint: LngLat[] = [];
  let minDistance = Infinity;

  polygon.forEach((point: LngLat[]) => {
    console.log(point);
    const distance = ymaps.coordSystem.geo.getDistance(clickCoords, point);

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  });

  return closestPoint;
};

const init = (): void => {
  mapObject = new ymaps.Map(mapElement.value, {
    center: [55.75, 37.50],
    zoom: 10,
  }, {
    searchControlProvider: 'yandex#search',
  });

  const mkadPolygon = new ymaps.Polygon(polygonCoords.value);
  mapObject.geoObjects.add(mkadPolygon);

  const mkadLost = [[...polygonStore.getOuterAreaPolygon()]];
  const mkadPolygonLost = new ymaps.Polygon(mkadLost);

  mapObject.geoObjects.add(mkadPolygonLost);

  mapObject.events.add('click', (e: any) => {
    const clickCoords = e.get('coords');

    const isInside = mkadPolygon.geometry.contains(clickCoords);

    if (isInside) return;

    const objectsToRemove: any[] = [];

    mapObject.geoObjects.each((geoObject: any) => {
      if (geoObject !== mkadPolygon && geoObject !== mkadPolygonLost) {
        objectsToRemove.push(geoObject);
      }
    });

    objectsToRemove.forEach((geoObject) => {
      mapObject.geoObjects.remove(geoObject);
    });

    ymaps.geocode(clickCoords).then((res: any) => {
      const obj = res.geoObjects.get(0);
      if (!obj) {
        return;
      }
      addressMark.value = obj
        .getAddressLine();
    });

    const polygon: LngLat[][] = mkadPolygon.geometry.getCoordinates()[0];

    const closestPoint: LngLat[] = findClosestPoint(clickCoords, polygon);

    const straightDistance = ymaps.coordSystem.geo.getDistance(clickCoords, closestPoint);

    const placemark = new ymaps.Placemark(closestPoint);

    distanceLine.value = `${(straightDistance / 1000).toFixed(2)} км`;

    const straightLine = new ymaps.Polyline(
      [clickCoords, closestPoint],
      {
        strokeColor: '#FF0000',
        strokeWidth: 2,
        strokeStyle: 'dash',
      },
    );

    ymaps.route([clickCoords, closestPoint], {
      mapStateAutoApply: false,
      routingMode: 'auto',
    }).then((route: any) => {
      mapObject.geoObjects.add(placemark);
      mapObject.geoObjects.add(straightLine);
      mapObject.geoObjects.add(route);

      clickStore.addClick({
        coords: clickCoords,
        address: addressMark.value,
        straightDistance: distanceLine.value,
        autoDistance: distanceAuto.value,
      });

      distanceAuto.value = `${(route.getLength() / 1000).toFixed(2)} км`;

      showInfoBlock.value = true;
    }, (error: any) => {
      console.error('Ошибка при построении маршрута: ', error);
    });
  });
};

ymaps.ready(init);
</script>

<template>
  <div id="map" ref="map" class="map-container h-full" />
  <div v-if="showInfoBlock" id="info-block" class="fixed top-12 right-2 w-[400px] bg-white rounded-xl p-4">
    <div>Адрес выбраной точки: <br> {{ addressMark }}</div>
    <div>Дистанция по прямой: {{ distanceLine }}</div>
    <div>Дистанция по дороге: {{ distanceAuto }}</div>
  </div>
</template>

<style scoped></style>
