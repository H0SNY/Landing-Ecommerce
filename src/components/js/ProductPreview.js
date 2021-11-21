import React from 'react';
import getCurrencySymbol from '../../assets/currencies';
import mainClasses from '../../MainCss/MainClasses.module.css';
import classes from '../css/ProductPreview.module.css';
import { Link } from 'react-router-dom';
export default class ProductPreview extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { id , image, name, price, inStock } = this.props;
		return (
			<Link to = {`/product/${id}`} className={`${mainClasses.container} ${mainClasses.column} ${classes.root}`}>
				
				<div className={`${mainClasses.container} ${classes.imgroot}`}>
					<img className={classes.img} alt="product" src={image} />
					{inStock ? (
					''
				) : (
					<div className = {classes.outofstock}>
						<p>"OUT OF STOCK"</p>
					</div>
				)}
				</div>
				<div className={`${mainClasses.container} ${classes.nameroot} ${inStock ? '' : classes.light}`}>
					<p>{name}</p>
				</div>
				<div className={`${mainClasses.container} ${classes.priceroot}  ${inStock ? '' : classes.light}`}>
					<p>
						{price.amount} {getCurrencySymbol(price.currency)}
					</p>
				</div>
			</Link>
		);
	}
}
