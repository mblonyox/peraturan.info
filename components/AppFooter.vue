<template>
  <footer>
    <UContainer class="border-t border-gray-200 dark:border-gray-800 py-2 flex justify-between">
      <p class="text-sm text-gray-500">
        {{ $t("crafted-by") }}
        <ULink to="https://x.com/mblonyox" target="_blank">@mblonyox</ULink>
      </p>
      <UTooltip text="Github Repository">
        <ULink to="https://github.com/mblonyox/peraturan.info" target="_blank" aria-label="Github Repository">
          <UIcon name="i-hugeicons-github-01" class="text-gray-500" />
        </ULink>
      </UTooltip>
    </UContainer>
  </footer>
</template>