export class User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: {};
  id: string;

  constructor(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    avatar?: {}
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    if (avatar && "value" in avatar) {
      this.avatar = avatar;
    } else {
      this.avatar = { value: "colour/001-man.png" };
    }
    this.id = "";
  }

  setId(id: string) {
    this.id = id;
  }
}
