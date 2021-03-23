export class User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  id: string;

  constructor(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ){
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.id = "";
  }

  setId(id: string){
    this.id = id;
  }
}
