<template>
  <header class="border-b border-gray-200 dark:border-gray-800">
    <UContainer class="flex items-center justify-between">
      <ULink :to="localePath('/')">
        <UIcon name="i-hugeicons-home-06" class="me-1" />
        <span class="text-lg text-primary font-bold">Peraturan</span>
        <span class="text-sm text-gray-500">.info</span>
      </ULink>
      <UHorizontalNavigation :links="links" :ui="{ wrapper: 'relative w-auto' }" />
      <div class="flex gap-2">
        <SelectLanguage />
        <ToggleDarkMode />
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
import type { HorizontalNavigationLink } from "#ui/types";

const localePath = useLocalePath();
const { t } = useI18n();
const links = computed<HorizontalNavigationLink[]>(() => [
  { label: t("new"), icon: "i-hugeicons-news-01", to: localePath("/new") },
  { label: t("regulations"), icon: "i-hugeicons-legal-document-01", to: localePath("regulations") },
  { label: t("court-rulings"), icon: "i-hugeicons-legal-document-02", to: localePath("court-rulings") },
  { label: t("definitions"), icon: "i-hugeicons-left-to-right-list-star", to: localePath("definitions") },
])
</script>
