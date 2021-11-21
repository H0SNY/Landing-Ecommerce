import React from 'react';
import { Link } from 'react-router-dom';
import getCurrencySymbol from '../../assets/currencies';
import mainClasses from '../../MainCss/MainClasses.module.css';
import { getAttr, getFirstNameAndLastName, getPrice } from '../../__helpers__/product';
import classes1 from '../css/CartPreview1.module.css';
import classes2 from '../css/CartPreview2.module.css';
export default class CartPreview extends React.Component {
	constructor(props) {
		super(props);
		console.log(props.type);
		if (this.props.type === 'page') this.classes = classes2;
		else this.classes = classes1;
		this.renderProduct = this.renderProduct.bind(this);
		this.renderAttr = this.renderAttr.bind(this);
		this.renderAttributeItem = this.renderAttributeItem.bind(this);
		this.handleControl = this.handleControl.bind(this);
	}

	handleControl(type, id) {
		return () => {
			console.log('inside cartpreview , type: ', type, 'id : ', id);
			this.props.cartControl(type, id);
		};
	}

	renderAttributeItem(type, selectedId) {
		return (item) => {
			switch (type) {
				case 'text':
					return (
						<div key={item.value} className={`${mainClasses.container} ${mainClasses.center} ${this.classes.attritem} ${item.id === selectedId ? this.classes.selected : ''}`}>
							<p>{item.value}</p>
						</div>
					);
				case 'swatch':
					return <div key={item.value} className={`${mainClasses.container} ${mainClasses.center} ${this.classes.attritem} ${item.id === selectedId ? this.classes.colorselected : ''}`} style={{ backgroundColor: item.value }} />;
				default:
					return;
			}
		};
	}
	renderAttr(selectedProduct) {
		return (attr) => {
			const { name, type, items } = attr;
			const selectedId = getAttr(name, selectedProduct);
			return (
				<div key={name} className={`${mainClasses.container} ${mainClasses.column} ${this.classes.attrroot}`}>
					<div className={`${mainClasses.container} ${mainClasses.row} ${this.classes.attritemsroot}`}>{items.map(this.renderAttributeItem(type, selectedId))}</div>
				</div>
			);
		};
	}

	renderProduct(product) {
		const { name, prices, qty, gallery, attributes, selectedProduct, id } = product;
		const [firstName, restOfName] = getFirstNameAndLastName(name);
		const price = getPrice(prices, this.props.currency);
		return (
			<div className={`${mainClasses.container} ${mainClasses.row} ${mainClasses.space_evenly} ${this.classes.productroot}`}>
				<div className={`${mainClasses.container} ${mainClasses.column} ${this.classes.mainroot}`}>
					<div className={`${mainClasses.container} ${mainClasses.column}`}>
						<p className={this.classes.firstname}>{firstName}</p>
						{restOfName ? <p className={this.classes.restofname}>{restOfName}</p> : ''}
					</div>
					<div className={this.classes.priceroot}>
						<p>
							{getCurrencySymbol(price?.currency)}
							{String(qty * price?.amount).slice(0, 7)}
						</p>
					</div>
					{attributes.map(this.renderAttr(selectedProduct))}
				</div>
				<div className={`${mainClasses.container} ${mainClasses.column} ${mainClasses.space_evenly} ${this.classes.controlroot}`}>
					<button className={`${this.classes.controlbutton} ${mainClasses.container} ${mainClasses.center}`} onClick={this.handleControl('add', id)}>
						<p>+</p>
					</button>
					<p className={this.classes.qtyitem}>{qty}</p>
					<button className={`${this.classes.controlbutton} ${mainClasses.container} ${mainClasses.center}`} onClick={this.handleControl('remove', id)}>
						<p>-</p>
					</button>
				</div>
				<div className={`${mainClasses.container} ${this.classes.imgroot} ${mainClasses.center}`}>
					<img alt="product" src={gallery[0]} className={this.classes.img} />
				</div>
			</div>
		);
	}

	render() {
		const { products, price } = this.props.cart;
		return (
			<div className={`${mainClasses.container} ${mainClasses.column} ${this.classes.root}`}>
				<div className={`${this.classes.qtyroot} ${mainClasses.container} ${mainClasses.row} ${mainClasses.space_around} ${this.classes.headerroot}`}>
					<p className={this.classes.mybag}>My Bag</p>
					<p className={this.classes.qty}>{products.length} items</p>
				</div>
				{products.map(this.renderProduct)}
				<div className={`${mainClasses.container} ${mainClasses.row} ${mainClasses.space_evenly} ${this.classes.totalpriceroot}`}>
					<p className={this.classes.total}>Total</p>
					<p className={this.classes.totalprice}>
						{getCurrencySymbol(this.props.currency)}
						{String(price).slice(0 , 8)}
					</p>
				</div>
				<div className={`${mainClasses.container} ${mainClasses.row} ${mainClasses.space_evenly} ${this.classes.maincontrol}`}>
					{this.props.type ==='page' ? "" : <Link to="/cart">
						<button className={this.classes.viewbag}>View Bag</button>
					</Link>}
					<button className={this.classes.checkout}>Checkout</button>
				</div>
			</div>
		);
	}
}
