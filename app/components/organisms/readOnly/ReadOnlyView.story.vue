<template>
	<Story title="Organisms/ReadOnlyView">
		<Variant title="default">
			<ReadOnlyView title="Liqueur" back-to="/categories" back-label="Categories">
				<FormSection title="Names" description="How the category appears in each language.">
					<dl class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
						<ReadOnlyField label="name" value="Liqueur" />
						<ReadOnlyField label="alcoholic" :flag="true" />
					</dl>
				</FormSection>
			</ReadOnlyView>
		</Variant>
	</Story>
</template>
