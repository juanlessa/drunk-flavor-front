<template>
    <Story title="Atoms/TextInput">
        <template #controls="{ state }">
            <HstText v-model="state.placeholder" title="placeholder" />
            <HstCheckbox v-model="state.hasError" title="has error" />
            <HstCheckbox v-model="state.border" title="border" />
        </template>
        <Variant title="default" :init-state="initState">
            <template #default="{ state }">
                <TextInput
                    :has-error="state.hasError"
                    :border="state.border"
                    :placeholder="state.placeholder"
                />
            </template>
        </Variant>
        <Variant title="sufix" :init-state="initState">
            <template #default="{ state }">
                <TextInput
                    suffix="ml"
                    :has-error="state.hasError"
                    :border="state.border"
                    :placeholder="state.placeholder"
                />
            </template>
        </Variant>
        <Variant title="sufix-outside" :init-state="initState">
            <template #default="{ state }">
                <TextInput
                    suffix="ml"
                    suffix-outside
                    :has-error="state.hasError"
                    :border="state.border"
                    :placeholder="state.placeholder"
                />
            </template>
        </Variant>
    </Story>
</template>
<script lang="ts" setup>
function initState() {
    return {
        id: 'input',
        name: 'input',
        hasError: false,
        border: false,
        placeholder: ''
    }
}
</script>
