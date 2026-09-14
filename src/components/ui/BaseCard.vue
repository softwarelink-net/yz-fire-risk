<template>
  <div :class="['card', padded ? '' : 'p-0']">
    <div
      v-if="title || $slots.header"
      class="mb-4 flex items-start justify-between gap-3"
      :class="{ 'px-5 pt-5': !padded }"
    >
      <div>
        <h3 v-if="title" class="text-base font-semibold text-slate-100">{{ title }}</h3>
        <p v-if="subtitle" class="mt-0.5 text-sm text-slate-400">{{ subtitle }}</p>
        <slot name="header" />
      </div>
      <div v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>
    <div :class="{ 'px-5 pb-5': !padded && (title || $slots.header) }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    padded?: boolean
  }>(),
  { padded: true },
)
</script>
