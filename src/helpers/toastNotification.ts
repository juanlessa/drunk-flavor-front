export const generateId = () => {
	return `alert-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};
