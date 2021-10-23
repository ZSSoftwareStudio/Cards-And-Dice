import Category from './Category';

export default interface Product {
  id?: string;
  title: string;
  description: string;
  image: string;
  price: number;
  category: Category;
}
