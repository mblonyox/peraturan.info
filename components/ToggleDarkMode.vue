<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})
</script>

<template>
  <ClientOnly>
    <UTooltip :text="isDark ? $t('dark-mode') : $t('light-mode')">
      <UButton :icon="isDark ? 'i-hugeicons-moon-02' : 'i-hugeicons-sun-03'" color="gray" variant="outline"
        aria-label="Theme" @click="isDark = !isDark" />
    </UTooltip>
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>