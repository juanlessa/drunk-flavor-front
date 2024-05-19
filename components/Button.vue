<template>
    <button :class="buttonStyles({ variant: props.variant, size: props.size })">
        <slot />
    </button>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants'

type ButtonVariant = 'primary' | 'secondary' | 'delete'
type ButtonSize = 'md' | 'sm'

const buttonStyles = tv({
    base: 'h-10 w-full max-w-80 tablet:max-w-64 rounded-full cursor-pointer font-normal text-center px-4',
    variants: {
        variant: {
            primary: 'bg-blue-400 text-white',
            secondary: 'bg-gray-300 text-black',
            delete: 'bg-red-300 text-black dark:bg-red-600 dark:text-white'
        },
        size: {
            sm: 'h-8',
            md: 'h-10 text-base'
        }
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md'
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
    }
})
</script>
<style></style>
