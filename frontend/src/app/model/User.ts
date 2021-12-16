export default interface User {
  id: string;
  name: string;
  email: string;
  phone?: String;
  address?: String;
  country?: String;
  state?: String;
  zipcode?: String;
  image: string;
  role: string;
}
