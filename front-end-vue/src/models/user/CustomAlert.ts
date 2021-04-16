import { User } from "./User";

export class CustomAlert {
  status: number;
  message: string;
  error?: any;
  user?: User;

  constructor(status: number, message: string, error?: any, user?: User) {
    this.status = status;
    this.message = message;
    this.error = error;
    this.user = user;
  }
}
