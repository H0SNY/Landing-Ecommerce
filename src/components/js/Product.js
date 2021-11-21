import React from 'react';
import { withRouter } from 'react-router';
import { getFirstNameAndLastName } from '../../__helpers__/product';
import getCurrencySymbol from '../../assets/currencies';
import { LOAD_PRODUCT } from '../../graphql/queries';
import mainClasses from '../../MainCss/MainClasses.module.css';
import classes from '../css/Product.module.css';
class Product extends React.Component {
	constructor(props) {
		super(props);
		this.client = this.props.client;
		this.id = this.props.match.params.id;
		this.state = {
			loading: true,
			product: {},
			mainImage: '',
			selectedProduct: [],
		};
		this.renderImage = this.renderImage.bind(this);
		this.renderAttribute = this.renderAttribute.bind(this);
		this.renderAttributeItem = this.renderAttributeItem.bind(this);
		this.handleImage = this.handleImage.bind(this);
		this.selectAttr = this.selectAttr.bind(this);
		this.getPrice = this.getPrice.bind(this);
		this.addToCart = this.addToCart.bind(this);
	}

	async componentDidMount() {
		const { data } = await this.client.query({
			query: LOAD_PRODUCT,
			variables: {
				productId: this.id,
			},
		});
		const { product } = data;
		const selected = [];

		for (let i = 0; i < product.attributes.length; i++) {
			selected.push({
				name: product.attributes[i]?.name,
				value: product.attributes[i]?.items[0]?.id,
			});
		}
		this.setState((prevState) => ({ ...prevState, loading: false, product: product, mainImage: product?.gallery[0], selectedProduct: selected }));
	}

	handleImage(e) {
		this.setState((prevState) => ({ ...prevState, mainImage: e.target.currentSrc }));
	}

	selectAttr(item, attrName) {
		return () => {
			const arr = this.state.selectedProduct;
			for (let i = 0 ; i < arr.length;  i++) {
				if (arr[i]?.name === attrName) {
					arr[i].value = item.id;
					this.setState((prevState) => ({ ...prevState, selectedProduct: arr }));
					return;
				}
			}
		};
	}

	addToCart(){
		const product = {
			...this.state.product , 
			selectedProduct : this.state.selectedProduct , 
			qty : 1
		}
		this.props.addProduct(product)();
	}

	getPrice(){
		const price = this.state.product?.prices?.find(price => price.currency === this.props.currency);
		return `${getCurrencySymbol(price.currency)} ${price.amount}`
	}

	renderImage(src) {
		return (
			<div onClick={this.handleImage} className={`${mainClasses.container} ${classes.optionimgroot}`} key={src}>
				<img className={classes.optionimg} alt="product" src={src} />
			</div>
		);
	}

	renderAttributeItem(type, attrName) {
		return (item) => {
			switch (type) {
				case 'text':
					return (
						<div onClick={this.selectAttr(item, attrName)} key={item.value} className={`${mainClasses.container} ${mainClasses.center} ${classes.attritem} ${this.state.selectedProduct.find((x) => x.name === attrName && x.value === item.id) && classes.selected}`}>
							<p>{item.value}</p>
						</div>
					);
				case 'swatch':
					return <div onClick={this.selectAttr(item, attrName)} key={item.value} className={`${mainClasses.container} ${mainClasses.center} ${classes.attritem} ${this.state.selectedProduct.find(x => x.name === attrName && x.value === item.id) && classes.selectedcolor}`} style={{ backgroundColor: item.value }} />;
				default:
					return;
			}
		};
	}

	renderAttribute(attr) {
		const { name, type, items } = attr;
		return (
			<div key={attr.name} className={`${mainClasses.container} ${mainClasses.column} ${classes.attrroot}`}>
				<p className={classes.attrname}>{name}</p>
				<div className={`${mainClasses.container} ${mainClasses.row} ${classes.attritemsroot}`}>{items.map(this.renderAttributeItem(type, name))}</div>
			</div>
		);
	}

	render() {
		const { name, inStock, gallery, description, category, attributes, prices, brand } = this.state.product;
		const [firstName , restOfName] = getFirstNameAndLastName(name);
		return (
			<>
				{this.state.loading ? (
					'loading......'
				) : (
					<div className={`${mainClasses.container} ${mainClasses.row} ${classes.root}`}>
						<div className={`${mainClasses.container} ${mainClasses.column} ${classes.imgsroot}`}>{this.state.product?.gallery?.map(this.renderImage)}</div>
						<div className={`${mainClasses.container} ${mainClasses.column} ${classes.mainimgroot}`}>
							<img className={classes.mainimg} alt="main img" src={this.state.mainImage} />
						</div>
						<div className={`${mainClasses.container} ${mainClasses.column} ${classes.info}`}>
							<div className={`${mainClasses.container} ${mainClasses.column}`}>
								<p className={classes.firstname}>{firstName}</p>
								{restOfName && <p className={classes.restofname}>{restOfName}</p>}
							</div>
							<div className={`${mainClasses.container} ${mainClasses.column} ${classes.attributesroot}`}>{attributes.map(this.renderAttribute)}</div>
							<div className = {`${mainClasses.container} ${mainClasses.column} ${classes.priceroot}`}>
								<p>{this.getPrice()}</p>
							</div>

							{inStock ? "" : <div>
								<p>This Item Is Not Available At The Moment</p>
							</div>}
							<div className = {`${mainClasses.container} ${classes.cartbuttonroot}`}>
								<button style = {{cursor : inStock ? 'pointer' : 'default'}} disabled = {!inStock} onClick = {this.addToCart} className = {classes.cartbutton}><p>ADD TO CART</p></button>
							</div>
							 <div className = {classes.desc} dangerouslySetInnerHTML={{ __html: description }} />
									
							
						</div>
					</div>
				)}
			</>
		);
	}
}

export default withRouter(Product);
