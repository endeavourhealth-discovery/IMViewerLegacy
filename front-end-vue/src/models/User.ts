const strongCheck = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

const mediumCheck = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

export class User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  id: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ){
    this.firstName = this.verifyFirstName(firstName);
    this.lastName = this.verifyLastName(lastName);
    this.email = this.verifyEmail(email);
    this.password = this.verifyPassword(password).result;
    this.id = "";
  }

  verifyEmail(email: any){
    if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      return email;
    } else {
      throw new Error("Invalid email address");
    }
  }
  verifyPassword(password: any){
    if (strongCheck.test(password)){
      return {result: password, strength: "strong"}
    } else if (mediumCheck.test(password)){
      return {result: password, strength: "medium"}
    } else {
      return {result: password, strength: "weak"}
    }
  }
  verifyFirstName(firstName: any){
    if (/^[a-zA-Z]+$/.test(firstName)){
      return firstName;
    } else {
      throw new Error("Invalid characters in First Name")
    }
  }
  verifyLastName(lastName: any){
    if (/^[a-zA-Z]+$/.test(lastName)){
      return lastName;
    } else {
      throw new Error("Invalid characters in Last Name")
    }
  }
}
