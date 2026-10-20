<template>
	<div v-if="isVisible" class="flex flex-col gap-3">
		<div
			class="h-1.5 w-full rounded-control bg-surface-sunken overflow-hidden"
			role="progressbar"
			:aria-valuemin="0"
			:aria-valuemax="STRENGTH_CRITERIA.length"
			:aria-valuenow="met"
			:aria-label="$t('atoms.passwordStrength.bar.label')">
			<div :class="barFillStyle({ level })" :style="{ width: `${barWidth}%` }" />
		</div>

		<ul class="flex flex-col gap-1">
			<li v-for="item in checklist" :key="item.key" :class="itemStyle({ met: item.met })">
				<CheckIcon v-if="item.met" class="size-4 shrink-0 fill-current" />
				<CloseIcon v-else class="size-4 shrink-0 fill-current" />
				<span class="text-body-sm font-regular text-current">
					{{ $t(item.label) }}
				</span>
				<span class="sr-only">
					{{
						item.met
							? $t('atoms.passwordStrength.state.met')
							: $t('atoms.passwordStrength.state.unmet')
					}}
				</span>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { tv } from '~/utils/tv';
import CheckIcon from '~/components/icons/CheckIcon.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';
import { STRENGTH_CRITERIA, computeStrength } from './PasswordStrength.helpers';

const props = defineProps({
	password: { type: String, default: '' },
	confirmPassword: { type: String, default: '' },
	active: { type: Boolean, default: false }
});

const isVisible = computed(() => props.active || props.password.length > 0);

const strength = computed(() => computeStrength(props.password));
const met = computed(() => strength.value.met);
const level = computed(() => strength.value.level);
const barWidth = computed(() => (met.value / STRENGTH_CRITERIA.length) * 100);

type ChecklistItem = { key: string; label: string; met: boolean };

const checklist = computed<ChecklistItem[]>(() => {
	const items: ChecklistItem[] = STRENGTH_CRITERIA.map((criterion) => ({
		key: criterion.key,
		label: `atoms.passwordStrength.requirements.${criterion.key}`,
		met: criterion.test(props.password)
	}));

	if (props.confirmPassword.length > 0) {
		items.push({
			key: 'match',
			label: 'atoms.passwordStrength.requirements.match',
			met: props.password === props.confirmPassword
		});
	}

	return items;
});

const barFillStyle = tv({
	base: 'h-full rounded-control transition-all',
	variants: {
		level: {
			weak: 'bg-danger',
			medium: 'bg-warning',
			strong: 'bg-success'
		}
	}
});

const itemStyle = tv({
	base: 'flex items-center gap-2',
	variants: {
		met: {
			true: 'text-success',
			false: 'text-content-muted'
		}
	}
});
</script>
