<template>
    <Story title="Atoms/TextInput">
        <template #controls="{ state }">
            <HstText v-model="state.placeholder" title="placeholder" />
            <HstCheckbox v-model="state.hasError" title="has error" />
            <HstCheckbox v-model="state.border" title="border" />
            <HstSelect v-model="state.type" title="type" :options="textInputTypeOptions" />
            <HstText v-model="state.id" title="id" />
            <HstText v-model="state.name" title="name" />
        </template>

        <Variant title="default" :init-state="initState">
            <template #default="{ state }">
                <TextInput
                    :id="state.id"
                    :type="state.type"
                    :name="state.name"
                    :has-error="state.hasError"
                    :border="state.border"
                    :placeholder="state.placeholder"
                />
            </template>
        </Variant>

        <Variant title="sufix" :init-state="initState">
            <template #default="{ state }">
                <TextInput
                    :id="state.id"
                    :type="state.type"
                    :name="state.name"
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
                    :id="state.id"
                    :type="state.type"
                    :name="state.name"
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
const textInputTypeOptions = ['text', 'number']

function initState() {
    return {
        id: '',
        name: '',
        type: 'text',
        hasError: false,
        border: false,
        placeholder: ''
    }
}
</script>
