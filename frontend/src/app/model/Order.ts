export default interface Order {
  totalPrice: number;
  products: {
    product: string;
    quantity: number;
  }[];
  couponcode: string;
}
