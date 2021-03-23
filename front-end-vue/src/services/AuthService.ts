import { Auth } from 'aws-amplify';
import { User } from "@/models/User";

export default {
  async register(userToRegister: User){
    try {
      const { user } = await Auth.signUp({
        username: userToRegister.email, //change to actual username?
        password: userToRegister.password,
        attributes: {
          email: userToRegister.email,
          'custom:firstName': userToRegister.firstName,
          'custom:lastName': userToRegister.lastName
        }
      })
      console.log(user)
      return { status: 201, message: "User registered successfully"}
    } catch (err) {
      console.log(err)
      return { status: 400, error: err, message: "User registration failed"}
    }
  },

  async confirmRegister(userToConfirmRegistration: User, code: string) {
    try {
      await Auth.confirmSignUp(userToConfirmRegistration.email, code)
      return {status: 200, message: "register confirmation successful"};
    } catch(err) {
      console.log(err);
      return { status: 403, error: err, message: "failed register confirmation"};
    }
  },

  async signIn(username: string, password: string){
    try {
      const user = await Auth.signIn(username, password)
      return {status: 200, user: user, message: "signIn successful"};
    } catch(err) {
      return {status: 403, error: err, message: "signIn failed"}
    }
  },

  async resendConfirmationCode(userForCode: User){
    try {
      await Auth.resendSignUp(userForCode.email)
      return {status: 200, message: "code resent successfully"}
    } catch(err) {
      return {status: 400, error: err, message: "error resending code"}
    }
  },

  async signOut(){
    try {
      await Auth.signOut({ global: true })
      return {status: 200, message: "signout successful"}
    } catch (err) {
      return {status: 400, error: err, message: "error signing out"}
    }
  }
}
