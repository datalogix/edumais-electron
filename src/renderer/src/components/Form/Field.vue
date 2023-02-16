<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
export interface FormFieldProps {
    errors?: object
    spacing?: boolean
    label?: string|boolean
    helper?: string
    name?: string
    modelValue?: any
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  spacing: true
})

const emit = defineEmits(['update:modelValue'])
const input = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div
    :class="{
      'mb-6': spacing
    }"
  >
    <slot
      v-if="label !== false"
      name="label"
    >
      <div class="flex items-center justify-between mb-2">
        <label :for="name" class="flex items-center space-x-2">
          <span>
            {{ label || name }}
          </span>

          <i
            v-if="helper"
            v-tooltip.top="helper"
          >
            <IconMdiHelp />
          </i>
        </label>
        <slot name="label-right" />
      </div>
    </slot>

    <div class="flex items-center space-x-2">
      <slot name="prepend" />

      <div class="w-full">
        <slot :props="props">
          <PInputText
            :id="name"
            v-bind="$attrs"
            v-model="input"
            :input-id="name"
            class="w-full"
          />
        </slot>
      </div>
      <slot name="append" />
    </div>

    <i
      v-if="errors && name && errors[name]"
      class="text-sm italic text-red-500 block mt-1"
      v-html="errors[name]"
    />
  </div>
</template>
