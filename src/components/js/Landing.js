import React from 'react';
import classes from '../css/Landing.module.css';
import mainClasses from '../../MainCss/MainClasses.module.css';
import ProductPreview from './ProductPreview';
export default class Landing extends React.Component {
	constructor(props) {
		super(props);
		this.client = props.client;
		this.renderProduct = this.renderProduct.bind(this);
		this.renderProducts = this.renderProducts.bind(this);
	}

	renderProduct(product) {
		return <ProductPreview currency = {this.props.currency} onAddToCart = {this.props.onAddToCart} product = {product} key={product.name} />;
	}

	renderProducts(products) {
		let i = 0;
		const rows = [];
		while (i < products?.length) {
			let temp = products.slice(i, Number(this.props.width) > 800 ? i + 3 : i + 1);
			rows.push(
				<div key={i} className={`${mainClasses.container} ${mainClasses.row} ${mainClasses.space_evenly} ${classes.row}`}>
					{temp.map(this.renderProduct)}
				</div>
			);
			if(Number(this.props.width) > 800) i += 3;
		else i += 1;
		}
		
		return rows;
	}

	render() {
		return (
			<div className={`${classes.root} ${mainClasses.container} ${mainClasses.column}`}>
				{this.props.loading ? (
					'loading....'
				) : (
					<>
						<div className={`${mainClasses.container} ${mainClasses.row} ${mainClasses.start} ${classes.category}`}>
							<p>{this.props.category.name}</p>
						</div>
						<div className={`${mainClasses.container} ${mainClasses.column} ${classes.products}`}>{this.renderProducts(this.props.products)}</div>
					</>
				)}
			</div>
		);
	}
}
