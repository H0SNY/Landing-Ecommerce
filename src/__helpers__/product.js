export function getPrice(prices, currency) {
	for (let i = 0; i < prices?.length; i++) if (prices[i]?.currency === currency) return prices[i];
	return false;
}

export function getAttr(name, selectedArr) {
	for (let i = 0; i < selectedArr?.length; i++) if (selectedArr[i]?.name === name) return selectedArr[i]?.value;
	return false;
}

export function getFirstNameAndLastName(name) {
	const names = name?.split(' ') || [];
	const firstName = names[0];
	names.shift();
	const restOfName = names.join(' ');
	return [firstName, restOfName];
}

export function createSelected(attrs) {
	const selected = []
	for (let i = 0; i < attrs.length; i++) {
		selected.push({
			name: attrs[i]?.name,
			value: attrs[i]?.items[0]?.id,
		});
	}
	return selected
}
