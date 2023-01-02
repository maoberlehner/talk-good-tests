<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue';

import {
  create,
  getList,
  Item,
} from '../repositories/shopping-list-repository';

import ShoppingList from './ShoppingList.vue';

let items = ref<Item[]>([]);

(async () => {
  items.value = await getList();
})();

let itemsActive = computed(() => items.value.filter(item => item.state === `active`));

let itemNewTitle = ref(``);
let addItem = async () => {
  await create({ title: itemNewTitle.value, state: `active` });
  items.value = await getList();
  itemNewTitle.value = ``;
};
</script>

<template>
  <div>
    <div class="space-y-8">
      <div class="space-y-4">
        <h2 class="text-2xl">
          Shopping list
        </h2>
        <ShoppingList
          :items="itemsActive"
          data-qa="active items"
        />
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl">
          Add new item
        </h2>
        <form @submit.prevent="addItem">
          <label for="title">
            Title
          </label>
          <div class="flex gap-2">
            <input
              id="title"
              v-model="itemNewTitle"
              name="title"
              class="flex-grow border border-teal-900 rounded p-2"
            >
            <button
              class="add-button rounded px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white transition-colors"
              @click.prevent="addItem"
            >
              Add item
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
