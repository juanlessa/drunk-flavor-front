import { abilitiesPlugin } from '@casl/vue';
import { defineAbilityForUser, defineRulesForUser } from '~/domain/accessControl';

export default defineNuxtPlugin({
	name: 'casl',
	dependsOn: ['auth'],
	setup(nuxtApp) {
		const { $auth } = useNuxtApp();

		const ability = defineAbilityForUser($auth.state.value.user);

		nuxtApp.vueApp.use(abilitiesPlugin, ability, { useGlobalProperties: true });

		watch(
			() => $auth.state.value.user,
			(user) => {
				ability.update(defineRulesForUser(user));
			}
		);
	}
});
