<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[variantClass, sizeClass, 'relative']"
    v-bind="$attrs"
  >
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    </span>
    <span :class="{ 'opacity-0': loading }" class="inline-flex items-center gap-2">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
  },
)

const variantClass = computed(() => {
  const map = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost:
      'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800',
  }
  return map[props.variant]
})

const sizeClass = computed(() => {
  const map = {
    sm: 'px-3 py-1.5 text-xs',
    md: '',
    lg: 'px-5 py-2.5 text-base',
  }
  return map[props.size]
})
</script>
