<script setup lang="ts">
import { defineProps } from 'vue';

import { Item } from '../repositories/shopping-list-repository';

const props = defineProps<{
  items: Item[];
}>();
</script>

<template>
  <ul class="space-y-2">
    <li v-for="item in props.items" :key="item.id" class="item">
      <div
        class="rounded px-4 py-3 bg-teal-600 text-white text-left w-full transition-colors"
      >
        {{ item.title }}
      </div>
    </li>
  </ul>
</template>
