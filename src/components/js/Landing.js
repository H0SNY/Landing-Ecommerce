import React from 'react';
import classes from '../css/Landing.module.css';
import mainClasses from '../../MainCss/MainClasses.module.css';
import { LOAD_CATEGORIES , LOAD_PRODUCTS_CATEGORY } from '../../graphql/queries';
import ProductPreview from './ProductPreview';
export default class Landing extends React.Component {
	constructor(props) {
		super(props);
		this.client = props.client;
		this.state = {
			categories: [],
			loading: true,
			category: null,
			products : [] ,
			currency : this.props.currency
		};
		this.handleCategory = this.handleCategory.bind(this);
		this.renderProduct = this.renderProduct.bind(this);
		this.renderProducts = this.renderProducts.bind(this);
	}

	async componentDidMount() {
		const { data : data1 } = await this.client.query({ query: LOAD_CATEGORIES });
		const { categories } = data1;
		const {data : data2} = await this.client.query({query : LOAD_PRODUCTS_CATEGORY , variables : {
			input : {
				title : categories[0].name
			}
		}})
		const {category} = data2;
		const {products} = category;
		this.setState(prevState=> ({ ...prevState, categories: categories, loading: false, category: categories[0]?.name , products : products}));
	}

	async handleCategory(e) {
		const {data} = await this.client.query({query : LOAD_PRODUCTS_CATEGORY , variables : {
			input : {
				title : e.target.value
			}
		}})
		const {category} = data;
		const {products} = category;
		this.setState(prevState => ({ ...prevState, category: e.target.value , products : products}));
	}

	renderCategory(category) {
		return (
			<option className = {classes.option} key={category.name} value={category.name}>
				{category.name}
			</option>
		);
	}

	renderProduct(product){
		const p = {
			name : product?.name , 
			price : product.prices.find(price => price.currency === this.props.currency) ,
			image : product.gallery[0] , 
			inStock : product.inStock , 
			id : product?.id
		}
		return (
			<ProductPreview {...p} key = {product.name}/>
		)
	}

	renderProducts(products){
		let i = 0;
		const rows = [];
		while(i < products?.length){
			let temp = products.slice(i , Number(this.props.width) > 800 ?  i+3 : i+2)
			rows.push(
				<div key = {i} className = {`${mainClasses.container} ${mainClasses.row} ${mainClasses.space_evenly} ${classes.row}`}>
					{temp.map(this.renderProduct)}
				</div>
			)
			i += 3;
		}
		return rows;
	}

	render() {
		return (
			<div className={`${classes.root} ${mainClasses.container} ${mainClasses.column}`}>
				<div className={`${mainClasses.container} ${mainClasses.row}`}>
					<label className={classes.categorylabel}>Choose Category</label>
					{this.state.loading ? 'loading' : <select onChange={this.handleCategory} className={classes.categorymenu}>{this.state.categories.map(this.renderCategory)}</select>}
				</div>
				<div className = {`${mainClasses.container} ${mainClasses.row} ${mainClasses.center} ${classes.category}`}><p>{this.state.category}</p></div>
				<div className = {`${mainClasses.container} ${mainClasses.column} ${classes.products}`}>
					{this.renderProducts(this.state.products)}
				</div>
			</div>
		);
	}
}
