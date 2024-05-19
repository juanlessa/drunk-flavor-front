<template>
    <button
        :class="buttonStyles({ variant: props.variant, size: props.size })"
        :disabled="props.disabled"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import { tv } from 'tailwind-variants'

type ButtonVariant = 'primary' | 'secondary' | 'delete'
type ButtonSize = 'sm' | 'md'

const buttonStyles = tv({
    base: 'w-full max-w-80 tablet:max-w-64 rounded-full font-normal text-center px-4 disabled:cursor-not-allowed',
    variants: {
        variant: {
            primary: 'bg-blue-700 hover:bg-blue-500 disabled:bg-blue-400 text-white',
            secondary: 'bg-gray-300  hover:bg-gray-100 disabled:bg-gray-100 text-black',
            delete: 'bg-red-600 hover:bg-red-400 disabled:bg-red-300  text-white'
        },
        size: {
            sm: 'py-1 text-base',
            md: 'py-2 text-base'
        }
    }
})

const props = defineProps({
    variant: {
        type: String as PropType<ButtonVariant>,
        default: 'primary'
    },
    size: {
        type: String as PropType<ButtonSize>,
        default: 'md'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})
</script>
<style></style>
