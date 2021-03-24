import { Auth } from 'aws-amplify';
import { User } from "@/models/User";

export default {
  async register(userToRegister: User){
    try {
      const { user } = await Auth.signUp({
        username: userToRegister.username,
        password: userToRegister.password,
        attributes: {
          email: userToRegister.email,
          'custom:forename': userToRegister.firstName,
          'custom:surname': userToRegister.lastName
        }
      })
      return { status: 201, message: "User registered successfully"}
    } catch (err) {
      console.log(err);
      return { status: 400, error: err, message: "User registration failed"};
    }
  },

  async confirmRegister(username: string, code: string) {
    try {
      await Auth.confirmSignUp(username, code)
      return {status: 200, message: "register confirmation successful"};
    } catch(err) {
      console.log(err);
      return { status: 403, error: err, message: "failed register confirmation"};
    }
  },

  async signIn(username: string, password: string){
    try {
      const user = await Auth.signIn(username, password)
      const signedInUser = new User(user.username, user.attributes['custom:forename'], user.attributes['custom:surname'], user.attributes.email, "")
      const accessToken = user.signInUserSession.accessToken.jwtToken;
      const idToken = user.signInUserSession.idToken.jwtToken;
      const refreshToken = user.signInUserSession.refreshToken.jwtToken;
      return {status: 200, user: signedInUser, accessToken: accessToken, idToken: idToken, refreshToken: refreshToken, message: "signIn successful"};
    } catch(err) {
      console.log(err);
      if (err.code === "UserNotConfirmedException"){
        return {status: 401, error:err, message: err.message} //message: "User is not confirmed."
      }
      return {status: 403, error: err, message: "signIn failed"}
    }
  },

  async resendConfirmationCode(username: string){
    try {
      await Auth.resendSignUp(username)
      return {status: 200, message: "code resent successfully"}
    } catch(err) {
      console.log(err);
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
  },

  // async updateUser(userToUpdate: User){
  //   const user = await Auth.currentAuthenticatedUser();
  //   if (user.attributes.sub === userToUpdate.id){
  //     const atts: object = {
  //       email: userToUpdate.email,
  //       "custom:forename": userToUpdate.firstName,
  //       "custom:surname": userToUpdate.lastName,
  //     }
  //   }
  // }
}
