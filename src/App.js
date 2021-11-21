import './App.css';
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Landing, Navbar } from './components';
import React from 'react';
import { Switch, Route } from 'react-router';
import Product from './components/js/Product';
import { getPrice } from './__helpers__/product';
import CartPreview from './components/js/CartPreview';

const errorLink = onError(({ graphqlErrors }) => {
	if (graphqlErrors) {
		graphqlErrors.map(() => {
			return alert('Error Boi!!!');
		});
	}
});

const link = from([errorLink, new HttpLink({ uri: 'http://192.168.1.3:4000/grapghql' })]);

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
			windowSize : window.innerWidth , 
		};
		if (!cart) localStorage.setItem('cart' , JSON.stringify(sample));
		this.handleCurrency = this.handleCurrency.bind(this);
		this.handleAddToCart = this.handleAddToCart.bind(this);
		this.handleCartControl = this.handleCartControl.bind(this);
		
	}

	componentDidMount(){
		window.addEventListener('resize' , () => this.setState(prevState => ({...prevState , windowSize : window.innerWidth })));
	}
	

	handleCurrency(currency) {
		this.setState((prevState) => ({ ...prevState, currency: currency }));
	}

	handleAddToCart(product) {
		return () => {
			const cart = this.state.cart;
			const test = cart.products.find(x => x.id === product.id);
			if(test) return;
			const price = getPrice(product.prices, this.state.currency);
			cart.price += price.amount;
			cart.products.push(product);
			this.setState((prevState) => ({ ...prevState, cart: cart }));
			localStorage.setItem('cart', JSON.stringify(cart));
		};
	}

	handleCartControl(type , id){
		return () =>{
			const cart = this.state.cart;
			for(let i = 0 ; i < cart?.products?.length ; i++){
					if(cart?.products[i].id === id){
						if(type === 'add'){
							cart.products[i].qty += 1;
							const price = getPrice(cart.products[i].prices ,  this.state.currency);
							cart.price += price.amount;
						}
						else{
							const price = getPrice(cart.products[i].prices ,  this.state.currency);
							cart.price -= price.amount;
							if(cart.products[i].qty === 1) cart.products.splice(i , 1);
							else cart.products[i].qty -= 1;
							
						}
						this.setState(prevState => ({...prevState , cart : cart}))
						return;
					}
			
			}
		}
	}

	setClickedToFalse(){
		this.setState(prevState => ({...prevState , windowClicked : false}))
	}

	render() {
		return (
			<div className="App">
				<Navbar cartControl = {this.handleCartControl} setCurrency={this.handleCurrency} cart={this.state.cart} currency={this.state.currency} client={client} />
				<Switch>
					<Route exact path="/">
						<Landing width = {this.state.windowSize} currency={this.state.currency} client={client} />
					</Route>
					<Route exact path="/product/:id">
						<Product addProduct={this.handleAddToCart} currency={this.state.currency} client={client} />
					</Route>
					<Route exact path = '/cart'>
						<CartPreview type = 'page' cartControl = {this.handleCartControl}  cart={this.state.cart} currency={this.state.currency}/>
					</Route>
				</Switch>
			</div>
		);
	}
}
