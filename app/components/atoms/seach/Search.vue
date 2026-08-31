<template>
	<Combobox.Root
		v-model:open="_open"
		:model-value="_modelValue"
		:search-term="_searchTerm"
		class="relative"
		:name="props.name"
		:display-value="(opt) => opt.label"
		:filter-function="filterOptionsBySearchTerm"
		@update:model-value="handleUpdateModelValue"
		@update:search-term="handleUpdateSearchTerm">
		<Combobox.Anchor
			:class="selectInputContainerStyle({ border: props.border, hasError: props.hasError })">
			<Combobox.Input
				class="flex-1 py-1 text-body font-regular outline-hidden border-none text-content !bg-transparent selection:bg-accent selection:text-content-on-accent placeholder-content-muted"
				:placeholder="props.placeholder" />

			<Combobox.Cancel>
				<ThinCloseIcon />
			</Combobox.Cancel>
			<Combobox.Trigger :id="props.id">
				<ChevronDownIcon />
			</Combobox.Trigger>
		</Combobox.Anchor>

		<Combobox.Content
			class="w-full z-dropdown absolute mt-1 overflow-hidden bg-surface-overlay rounded-md shadow-overlay will-change-[opacity,transform]">
			<Combobox.Viewport class="py-1">
				<Combobox.Empty as-child>
					<Text :value="props.noResult" class="text-center py-2" />
				</Combobox.Empty>

				<Combobox.Group ref="infiniteScrollContainer" class="max-h-28 overflow-y-auto">
					<Combobox.Item
						v-for="option in props.options"
						:key="option.value"
						class="relative text-body text-content rounded-md flex items-center pr-[35px] pl-[25px] select-none data-[disabled]:text-content-subtle data-[disabled]:pointer-events-none data-[highlighted]:outline-hidden data-[highlighted]:bg-accent-strong data-[highlighted]:text-content-on-accent"
						:value="option">
						<Combobox.ItemIndicator
							class="absolute left-0 w-[25px] inline-flex items-center justify-center">
						</Combobox.ItemIndicator>
						<span>
							{{ option.label }}
						</span>
					</Combobox.Item>
				</Combobox.Group>
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Root>
</template>
<script setup lang="ts">
import { Combobox } from 'radix-vue/namespaced';
import { tv } from 'tailwind-variants';
import type { InputSelectOption } from '../inputSelect/InputSelect.types';

const props = defineProps({
	searchTerm: { type: String, default: '' },
	options: { type: Array as PropType<InputSelectOption[]>, required: true },
	placeholder: { type: String, default: '' },
	id: { type: String, default: undefined },
	name: { type: String, default: undefined },
	noResult: { type: String, default: '' },
	border: { type: Boolean, default: false },
	hasError: { type: Boolean, default: false },
	infiniteScroll: { type: Boolean, default: false },
	loading: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'update:searchTerm', value: string): void;
	(e: 'select', value: InputSelectOption): void;
	(e: 'blur' | 'loadMore'): void;
}>();

const infiniteScrollContainer = ref<HTMLElement | null>(null);

const _open = ref(false);
const _modelValue = ref({ label: '', value: '' });
const _searchTerm = ref<string>(props.searchTerm);

if (props.infiniteScroll) {
	useInfiniteScroll(
		infiniteScrollContainer,
		() => {
			if (props.loading) return;
			emit('loadMore');
		},
		{ distance: 10 }
	);
}

watch(
	() => props.searchTerm,
	(newValue) => (_searchTerm.value = newValue)
);

const handleUpdateSearchTerm = (value: string) => {
	_searchTerm.value = value;
	emit('update:searchTerm', value);
};

const handleUpdateModelValue = (option: InputSelectOption) => {
	_modelValue.value = { label: '', value: '' };
	emit('select', option);
	emit('blur');
};

const selectInputContainerStyle = tv({
	base: 'w-full inline-flex items-center justify-between gap-2 rounded-lg px-3 box-border border-2 outline-hidden bg-surface-input border-surface-input focus-within:border-stroke-strong data-[placeholder]:text-content-muted',
	variants: {
		border: {
			true: 'border-stroke-control'
		},
		hasError: {
			true: 'border-danger-stroke'
		}
	}
});

const filterOptionsBySearchTerm = (
	options: InputSelectOption[],
	searchTerm: string
): InputSelectOption[] => {
	return options.filter(({ label }) => label.toLowerCase().includes(searchTerm.toLowerCase()));
};
</script>
