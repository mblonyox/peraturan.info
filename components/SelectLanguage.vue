<script setup lang="ts">
import type { DropdownItem } from "#ui/types";

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const items = computed(() => locales.value.map<DropdownItem>(l => ({ label: l.name ?? "", to: switchLocalePath(l.code) })))
</script>

<template>
  <UDropdown :items="[items]">
    <UTooltip :text="$t('change-language')">
      <UButton color="gray" variant="outline" icon="i-hugeicons-language-square">
        {{ locale }}
      </UButton>
    </UTooltip>
  </UDropdown>
</template>