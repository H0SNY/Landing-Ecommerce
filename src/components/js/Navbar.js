import React from 'react';
import classes from '../css/Navbar.module.css';
import mainClasses from '../../MainCss/MainClasses.module.css';
import Cart from '../../assets/shopping-cart.png';
import ArrowDown from '../../assets/down-arrow.png';
import ArrowUp from '../../assets/up-arrow.png';
import getCurrencySymbol from '../../assets/currencies';

export default class Navbar extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleCurrencies = this.handleCurrencies.bind(this);
		this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
		this.renderCurrency = this.renderCurrency.bind(this);
		this.handleCart = this.handleCart.bind(this);
		this.handleCartControl = this.handleCartControl.bind(this);
		this.handleCategory = this.handleCategory.bind(this);
		this.renderCategory = this.renderCategory.bind(this);
	}

	
	handleCategory(name){
		return() =>{
			this.props.changeCategory(name)
		}
		
	}
	

	handleCurrencies() {
		this.props.switchCurrencies();
		if(this.props.cartCollapsed) this.props.switchCart();
	}

	handleChangeCurrency(curr) {
		return () => {
			this.props.setCurrency(curr);
		};
	}

	handleCart() {
		this.props.switchCart();
		if(this.props.currenciesCollapsed) this.props.switchCurrencies();
	}

	handleCartControl(type, id) {
		this.props.cartControl(type, id)();
	}

	renderCategory(category) {
		return (
			<button key = {category.name} onClick = {this.handleCategory(category.name)} className={classes.link}>
				<p>{category.name}</p>
			</button>
		);
	}

	renderCurrency(currency) {
		return (
			<div onClick={this.handleChangeCurrency(currency)} className={classes.currency} key={currency}>
				<p>
					{getCurrencySymbol(currency)} {currency}
				</p>
			</div>
		);
	}

	render() {
		return (
			<div className={`${classes.root} ${mainClasses.container} ${mainClasses.row} ${mainClasses.space_between}`}>
				
				<div className={`${mainClasses.container} ${mainClasses.row} ${mainClasses.col_4} ${mainClasses.center}`}>
					{this.props.loading ? 'loading....' : this.props.categories.map(this.renderCategory)}
				</div>
				<div />

				<a href = '/' className={`${mainClasses.container} ${mainClasses.row} ${mainClasses.center} ${classes.icon} ${mainClasses.col_4}`}>
					<svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clipPath="url(#clip0_150_359)">
							<path d="M34.0222 28.6646C34.0494 28.983 33.8009 29.2566 33.4846 29.2566H7.46924C7.15373 29.2566 6.90553 28.9843 6.93156 28.6665L8.7959 5.91227C8.8191 5.62962 9.05287 5.41211 9.33372 5.41211H31.5426C31.8226 5.41211 32.0561 5.62853 32.0801 5.91036L34.0222 28.6646Z" fill="#1DCF65" />
							<path d="M36.0988 34.6014C36.1313 34.9985 35.8211 35.339 35.4268 35.339H5.59438C5.2009 35.339 4.89092 35.0002 4.92208 34.6037L7.06376 7.34717C7.09168 6.9927 7.38426 6.71973 7.73606 6.71973H33.1958C33.5468 6.71973 33.8391 6.99161 33.868 7.34499L36.0988 34.6014Z" fill="url(#paint0_linear_150_359)" />
							<path d="M19.9232 26.6953C16.0402 26.6953 12.8813 22.8631 12.8813 18.1528C12.8813 17.9075 13.0782 17.7085 13.3211 17.7085C13.564 17.7085 13.7608 17.9073 13.7608 18.1528C13.7608 22.3732 16.5253 25.8067 19.9234 25.8067C23.3214 25.8067 26.0859 22.3732 26.0859 18.1528C26.0859 17.9075 26.2827 17.7085 26.5257 17.7085C26.7686 17.7085 26.9654 17.9073 26.9654 18.1528C26.9653 22.8631 23.8062 26.6953 19.9232 26.6953Z" fill="white" />
							<path d="M24.2581 18.0337C24.1456 18.0337 24.0331 17.9904 23.9471 17.9036C23.7754 17.7301 23.7754 17.4488 23.9471 17.2753L26.226 14.9729C26.3084 14.8897 26.4203 14.8428 26.5369 14.8428C26.6536 14.8428 26.7654 14.8895 26.8479 14.9729L29.1045 17.2529C29.2762 17.4264 29.2762 17.7077 29.1045 17.8812C28.9327 18.0546 28.6543 18.0547 28.4826 17.8812L26.5368 15.9155L24.569 17.9036C24.4831 17.9904 24.3706 18.0337 24.2581 18.0337Z" fill="white" />
						</g>
						<defs>
							<linearGradient id="paint0_linear_150_359" x1="29.8733" y1="31.3337" x2="11.5132" y2="9.9008" gradientUnits="userSpaceOnUse">
								<stop stopColor="#52D67A" />
								<stop offset="1" stopColor="#5AEE87" />
							</linearGradient>
							<clipPath id="clip0_150_359">
								<rect width="31.16" height="30.176" fill="white" transform="translate(4.91992 5.41211)" />
							</clipPath>
						</defs>
					</svg>
				</a>
				<div />

				<div className={`${mainClasses.container} ${mainClasses.row} ${mainClasses.center} ${classes.control} ${mainClasses.col_4}`}>
					<div onClick = {this.handleCurrencies} className={classes.dollarroot}>{getCurrencySymbol(this.props.currency)}</div>
					<div className={`${classes.menuroot}`}>
						<button className={classes.downbutton} onClick={this.handleCurrencies} type="button" aria-expanded="false" aria-controls="currencycollapse">
							{this.props.currenciesCollapsed ? <img src={ArrowUp} className={classes.svgdown} alt="icon" /> :  <img src={ArrowDown} className={classes.svgdown} alt="icon" />
							}
						</button>
						<div className={`${mainClasses.container} ${mainClasses.column} ${mainClasses.center} ${classes.menu}`}>
							<div className = {classes.backdrop}>{this.props.currenciesCollapsed ? this.props.currencies.map(this.renderCurrency) : ''}</div>
							{this.props.loading ? 'loading...' : ''}
						</div>
					</div>
					<div className={classes.cartroot} onClick={this.handleCart}>
						<div className={`${classes.badge} ${mainClasses.container} ${mainClasses.column} ${mainClasses.center}`}>
							<p className = {classes.badgetext}>{(this.props.cart.products.length)}</p>
						</div>
						<img src={Cart} className={classes.svg} alt="icon" />
					</div>
				</div>
			</div>
		);
	}
}
