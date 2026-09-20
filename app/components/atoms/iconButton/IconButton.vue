<template>
	<button
		:type="props.type"
		:aria-label="props.ariaLabel"
		:disabled="props.disabled"
		class="inline-flex items-center justify-center rounded-icon-action p-1 cursor-pointer enabled:hover:bg-surface-hover focus-visible:shadow-focus-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-disabled">
		<slot />
	</button>
</template>
<script setup lang="ts">
/**
 * Botao que envolve apenas um icone.
 *
 * O `Button` atomo nao serve aqui: ele e full-width (`w-full max-w-80`) e
 * `rounded-full`, desenhado para acao primaria de formulario. Este cobre o
 * caso de acao inline -- remover item, fechar, editar.
 *
 * `ariaLabel` e obrigatorio de proposito: um botao que contem so um icone nao
 * tem texto acessivel, entao sem label ele fica invisivel para leitor de tela.
 *
 * A cor do icone NAO e controlada aqui -- cada icone traz o seu `fill-content`.
 * Este componente cuida de area de clique, hover, foco e semantica.
 */
const props = withDefaults(
	defineProps<{
		ariaLabel: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
	}>(),
	{
		type: 'button',
		disabled: false
	}
);
</script>
