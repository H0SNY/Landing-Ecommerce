import './App.css';
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Landing, Navbar } from './components';
import React from 'react';
import { Switch, Route } from 'react-router';
import Product from './components/js/Product';
import { getPrice } from './__helpers__/product';
import Cart from './components/js/Cart';
import './App.css';
import { LOAD_CATEGORIES, LOAD_PRODUCTS_CATEGORY, LOAD_CURRENCIES } from './graphql/queries';

const errorLink = onError(({ graphqlErrors }) => {
	if (graphqlErrors) {
		graphqlErrors.map(() => {
			return alert('Error Boi!!!');
		});
	}
});

const link = from([errorLink, new HttpLink({ uri: 'http://localhost:4000/grapghql' })]);

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: link,
});
export default class App extends React.Component {
	constructor() {
		super();
		let cart = localStorage.getItem('cart');
		let sample = {
			products: [],
			price: 0,
		};
		this.state = {
			currency: 'USD',
			cart: cart ? JSON.parse(cart) : sample,
			windowSize: window.innerWidth,
			categories: [],
			products: [],
			currencies: [],
			loading: true,
			category: null,
			currenciesCollapsed: false,
			cartCollapsed: false,
		};
		if (!cart) localStorage.setItem('cart', JSON.stringify(sample));
		this.handleCurrency = this.handleCurrency.bind(this);
		this.handleAddToCart = this.handleAddToCart.bind(this);
		this.handleCartControl = this.handleCartControl.bind(this);
		this.handleCategory = this.handleCategory.bind(this);
		this.handleGlobalClick = this.handleGlobalClick.bind(this);
		this.handleOpenCart = this.handleOpenCart.bind(this);
		this.handleOpenCurrencies = this.handleOpenCurrencies.bind(this);
		this.handleSelectAttr = this.handleSelectAttr.bind(this);
	}

	async componentDidMount() {
		window.addEventListener('resize', () => this.setState((prevState) => ({ ...prevState, windowSize: window.innerWidth })));
		const { data: data1 } = await client.query({ query: LOAD_CATEGORIES });
		const { categories } = data1;
		const { data: data2 } = await client.query({
			query: LOAD_PRODUCTS_CATEGORY,
			variables: {
				input: {
					title: categories[0].name,
				},
			},
		});
		const { category } = data2;
		const { products } = category;
		const { data: data3 } = await client.query({ query: LOAD_CURRENCIES });
		const { currencies } = data3;
		this.setState((prevState) => ({ ...prevState, products: products, categories: categories, currencies: currencies, loading: false, category: categories[0] }));
	}

	handleSelectAttr(attrName, item, productId) {
		const cart = this.state.cart;
		for (let i = 0; i < cart.products.length; i++) {
			if (cart.products[i]?.id === productId) {
				for (let j = 0; j < cart.products[i].selectedProduct.length; j++) {
					if (cart.products[i].selectedProduct[j].name === attrName) {
						cart.products[i].selectedProduct[j].value = item.value;
						break;
					}
				}
				this.setState((prevState) => ({ ...prevState, cart: cart }));
				return;
			}
		}
	}

	handleCurrency(currency) {
		this.setState((prevState) => ({ ...prevState, currency: currency }));
	}

	async handleCategory(name) {
		const { data } = await client.query({
			query: LOAD_PRODUCTS_CATEGORY,
			variables: {
				input: {
					title: name,
				},
			},
		});
		const { category } = data;
		const { products } = category;
		this.setState((prevState) => ({ ...prevState, category: name, products: products, category: { name: name } }));
	}

	handleAddToCart(product) {
		return () => {
			const cart = this.state.cart;
			const test = cart.products.find((x) => x.id === product.id);
			if (test) return;
			const price = getPrice(product.prices, this.state.currency);
			cart.price += price.amount;
			product = {...product , qty : 1}
			cart.products.push(product);
			this.setState((prevState) => ({ ...prevState, cart: cart }));
			localStorage.setItem('cart', JSON.stringify(cart));
		};
	}

	handleCartControl(type, id) {
		return () => {
			const cart = this.state.cart;
			for (let i = 0; i < cart?.products?.length; i++) {
				if (cart?.products[i].id === id) {
					if (type === 'add') {
						cart.products[i].qty += 1;
						const price = getPrice(cart.products[i].prices, this.state.currency);
						cart.price += price.amount;
					} else {
						const price = getPrice(cart.products[i].prices, this.state.currency);
						cart.price -= price.amount;
						if (cart.products[i].qty === 1) cart.products.splice(i, 1);
						else cart.products[i].qty -= 1;
					}
					this.setState((prevState) => ({ ...prevState, cart: cart }));
					return;
				}
			}
		};
	}
	handleGlobalClick(e) {
		if (e.target.accessKey === 'cart_control') return;
		if (this.state.currenciesCollapsed && this.state.cartCollapsed) this.setState((prevState) => ({ ...prevState, currenciesCollapsed: false, cartCollapsed: false }));
		else if (this.state.currenciesCollapsed) this.setState((prevState) => ({ ...prevState, currenciesCollapsed: false }));
		else if (this.state.cartCollapsed) this.setState((prevState) => ({ ...prevState, cartCollapsed: false }));
	}

	handleOpenCart() {
		this.setState((prevState) => ({ ...prevState, cartCollapsed: !prevState.cartCollapsed }));
	}
	handleOpenCurrencies() {
		this.setState((prevState) => ({ ...prevState, currenciesCollapsed: !prevState?.currenciesCollapsed }));
	}

	setClickedToFalse() {
		this.setState((prevState) => ({ ...prevState, windowClicked: false }));
	}

	render() {
		return (
			<div className="App" onClick={this.handleGlobalClick}>
				{this.state.cartCollapsed ? (
					<div className="overlay">
						{' '}
						<Cart selectAttr={this.handleSelectAttr} cartControl={this.handleCartControl} cart={this.state.cart} currency={this.state.currency} />{' '}
					</div>
				) : (
					''
				)}
				<Navbar switchCart={this.handleOpenCart} switchCurrencies={this.handleOpenCurrencies} changeCategory={this.handleCategory} cartControl={this.handleCartControl} setCurrency={this.handleCurrency} cart={this.state.cart} categories={this.state.categories} currencies={this.state.currencies} currenciesCollapsed={this.state.currenciesCollapsed} cartCollapsed={this.state.cartCollapsed} loading={this.state.loading} currency={this.state.currency} />
				<Switch>
					<Route exact path="/">
						<Landing onAddToCart={this.handleAddToCart} category={this.state.category} width={this.state.windowSize} currency={this.state.currency} products={this.state.products} loading={this.state.loading} />
					</Route>
					<Route exact path="/product/:id">
						<Product selectAttr={this.handleSelectAttr} addProduct={this.handleAddToCart} currency={this.state.currency} client={client} />
					</Route>
					<Route exact path="/cart">
						<Cart selectAttr={this.handleSelectAttr} type="page" cartControl={this.handleCartControl} cart={this.state.cart} currency={this.state.currency} />
					</Route>
				</Switch>
			</div>
		);
	}
}
