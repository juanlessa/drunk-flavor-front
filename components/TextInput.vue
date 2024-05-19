<template>
    <div class="flex items-center gap-3">
        <div :class="textInputContainerStyle({ hasError: props.hasError, border: props.border })">
            <input
                :id="props.id"
                :value="props.modelValue"
                class="w-full text-lg font-normal leading-6 outline-none border-none text-dark bg-transparent placeholder-gray-600"
                :type="props.type"
                :name="props.name"
                :placeholder="props.placeholder"
                :pattern="`${props.pattern}`"
                @input="handleUpdateInput"
                @blur="handleBlurInput"
            />
            <div v-if="props.suffix && !props.suffixOutside" class="text-suffix">
                {{ props.suffix }}
            </div>
        </div>
        <div v-if="props.suffix && props.suffixOutside" class="text-suffix">
            {{ props.suffix }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants'

const textInputContainerStyle = tv({
    base: 'flex items-center gap-2 bg-white py-2 px-3 rounded-lg box-border border-2 border-white input-container-focus-border',
    variants: {
        border: {
            true: 'border-gray-600'
        },
        hasError: {
            true: 'border-red-500'
        }
    }
})

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'text'
    },
    name: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    pattern: {
        type: String,
        default: ''
    },
    suffix: {
        type: String,
        default: ''
    },
    suffixOutside: {
        type: Boolean,
        default: false
    },
    border: {
        type: Boolean,
        default: false
    },
    hasError: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'blur'): void
}>()

const handleUpdateInput = (event: Event) => {
    const inputElement = event.target as HTMLInputElement
    emit('update:modelValue', inputElement.value)
}

const handleBlurInput = (event: Event) => {
    const inputElement = event.target as HTMLInputElement
    emit('update:modelValue', inputElement.value)
    emit('blur')
}

/*

<template>
    <div class="flex items-center gap-3">
        <div
            :class="[
                'flex items-center gap-2 bg-white py-2 px-3 rounded-lg box-border border-2 border-white input-container-focus-border',
                { border: props.border },
                { 'border-gray-500': props.border },
                { '!border-red-500': props.hasError },
                { '!border-2': props.hasError }
            ]"
        >
            <input
                :id="props.id"
                :value="props.modelValue"
                class="w-full text-lg font-normal leading-6 outline-none border-none text-dark bg-transparent placeholder-gray-600"
                :type="props.type"
                :name="props.name"
                :placeholder="props.placeholder"
                :pattern="`${props.pattern}`"
                @input="handleUpdateInput"
                @blur="handleBlurInput"
            />
            <div v-if="props.suffix && !props.suffixOutside" class="text-suffix">
                {{ props.suffix }}
            </div>
        </div>
        <div v-if="props.suffix && props.suffixOutside" class="text-suffix">
            {{ props.suffix }}
        </div>
    </div>
</template>


*/
</script>
<style scoped>
.input-container-focus-border:has(> input:focus) {
    border-color: black;
}
</style>
