<template>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger as-child>
			<button
				type="button"
				:class="triggerStyles({ labelled: props.labelled })"
				:aria-label="$t('organisms.languageSwitcher.label')">
				<GlobeIcon class="size-4 shrink-0 text-content-secondary" aria-hidden="true" />
				<span :class="props.labelled ? 'flex-1 text-left' : ''">
					{{ props.labelled ? currentOption?.name : currentOption?.code }}
				</span>
				<ChevronDownIcon
					class="size-2.5 shrink-0 fill-current! text-content-muted"
					aria-hidden="true" />
			</button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				class="z-popover w-(--radix-dropdown-menu-trigger-width) p-1 flex flex-col rounded-overlay bg-surface-elevated border border-stroke shadow-overlay"
				align="start"
				:side-offset="6"
				:collision-padding="8">
				<DropdownMenu.RadioGroup
					:model-value="locale"
					@update:model-value="handleUpdateLocale">
					<DropdownMenu.RadioItem
						v-for="option in LANGUAGE_OPTIONS"
						:key="option.value"
						:value="option.value"
						:class="itemStyles({ labelled: props.labelled })"
						:aria-label="option.name">
						<span class="flex-1">{{ props.labelled ? option.name : option.code }}</span>
						<DropdownMenu.ItemIndicator>
							<CheckIcon
								class="size-4 fill-current! text-accent-content"
								aria-hidden="true" />
						</DropdownMenu.ItemIndicator>
					</DropdownMenu.RadioItem>
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</template>
<script setup lang="ts">
import { DropdownMenu } from 'radix-vue/namespaced';
import CheckIcon from '~/components/icons/CheckIcon.vue';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import GlobeIcon from '~/components/icons/GlobeIcon.vue';
import { tv } from '~/utils/tv';

/** Language names are shown in their own language so anyone can find theirs. */
const LANGUAGE_OPTIONS = [
	{ value: 'en', code: 'EN', name: 'English' },
	{ value: 'pt', code: 'PT', name: 'Português' }
] as const;

const props = defineProps({
	/** Full-width variant with the language name, used inside the mobile menu. */
	labelled: { type: Boolean, default: false }
});

const { locale, setLocale } = useI18n();
/** The radio group emits a plain string; setLocale only accepts a configured locale. */
type AppLocale = Parameters<typeof setLocale>[0];

const currentOption = computed(() => LANGUAGE_OPTIONS.find(({ value }) => value === locale.value));

const handleUpdateLocale = (value: string) => setLocale(value as AppLocale);

// The menu takes the trigger's width, so the compact variant lists the short codes.
const itemStyles = tv({
	base: 'min-h-11 flex items-center gap-2 rounded-option text-content cursor-pointer select-none outline-hidden data-[highlighted]:bg-surface-hover',
	variants: {
		labelled: {
			true: 'px-3 text-body',
			false: 'px-2.5 text-body-sm font-medium'
		}
	}
});

const triggerStyles = tv({
	base: 'inline-flex items-center gap-2 rounded-full border border-stroke text-body-sm font-medium text-content-secondary cursor-pointer hover:bg-surface-hover data-[state=open]:bg-surface-hover focus-visible:outline-hidden focus-visible:shadow-focus-ring',
	variants: {
		labelled: {
			true: 'w-full h-11 px-4',
			false: 'h-10 px-3'
		}
	}
});
</script>
