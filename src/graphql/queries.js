import { gql } from '@apollo/client';

export const LOAD_ITEMS = gql`
	query {
		currencies
	}
`;

export const LOAD_CATEGORIES = gql`
	query {
		categories {
			name
		}
	}
`;

export const LOAD_CURRENCIES = gql`
	query {
		currencies
	}
`;

export const LOAD_PRODUCTS_CATEGORY = gql`
query ($input: CategoryInput) {
  category(input: $input) {
    products {
        id , 
      name , 
      inStock , 
      gallery , 
      description , 
      category , 
      attributes {
        id , 
        name , 
        type , 
        items {
          id , 
          displayValue , 
          value
        }
      } , 
      prices {
        amount , 
        currency
      } , 
      brand
    }
    }
  }

`;

export const LOAD_PRODUCT = gql`
  query ($productId: String!){
  product(id: $productId) {
    id ,
    name , 
    prices {
      amount , 
      currency
    }
    attributes {
      items {
        id
        value
      }
      name ,
      id , 
      type
    }
    inStock , 
    description , 
    category , 
    brand

    gallery
  }
}
`
