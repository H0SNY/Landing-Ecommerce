export function getTotalQuantity(cart){
	let count = 0;
	for(let i = 0 ; i < cart?.products?.length ;i++){
		count += cart.products[i].qty;
	}
	return count;
}