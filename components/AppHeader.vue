<template>
  <Menubar :model="items">
    <template #item="{ item, props, hasSubmenu }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </router-link>
      <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
        <span :class="item.icon" />
        <span>{{ item.label }}</span>
        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
      </a>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const items: Ref<MenuItem[]> = ref([
  { label: "Beranda", icon: "pi pi-home", route: "/" },
  { label: "Terbaru", icon: "pi pi-sparkles", route: "/terbaru" },
  {
    label: "Peraturan", icon: "", items: [
      { label: "Undang-undang", route: "/uu" },
      { label: "PERPPU", route: "/perppu" },
      { label: "Peraturan Pemerintah", route: "/pp" }
    ]
  }
])
</script>

<style scoped>
span:not(:first-child) {
  margin-left: .5rem;
}
</style>