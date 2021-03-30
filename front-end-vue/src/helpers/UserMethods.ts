import { PasswordStrength } from "@/models/PasswordStrength";

export function verifyIsEmail(email: any){
  if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
    return true;
  } else {
    return false;
  }
}

export function verifyPasswordsMatch(password1: string, password2:string){
  if (password1 !== "" && password2 !== "" && password1 === password2){
    return true;
  } else {
    return false;
  }
}

export function verifyEmailsMatch(email1: string, email2: string){
  if (email1 !== "" && email2 !== "" && email1.toLowerCase() === email2.toLowerCase()){
    return true;
  } else {
    return false;
  }
}

export function verifyIsName(name: string){
  if (name !== "" && /^[a-zA-Z]+$/.test(name)){
    return true;
  } else {
    return false
  }
}

export function verifyIsUsername(name: string){
  if (name !== "" && /^[a-zA-Z0-9]/.test(name)){
    return true;
  } else {
    return false;
  }
}

export function checkPasswordStrength(password: any){
  const strongCheck = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
  const mediumCheck = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
  const weakCheck = new RegExp("^(?=.{8,})")
  if (strongCheck.test(password)){
    return PasswordStrength.strong;
  } else if (mediumCheck.test(password)){
    return PasswordStrength.medium;
  } else if (weakCheck.test(password)){
    return PasswordStrength.weak;
  } else {
    return PasswordStrength.fail;
  }
}
