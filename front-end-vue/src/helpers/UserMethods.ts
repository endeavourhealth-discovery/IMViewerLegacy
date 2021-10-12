import { PasswordStrength } from "@/models/user/PasswordStrength";

export function verifyIsEmail(email: string): boolean {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

export function verifyPasswordsMatch(password1: string, password2: string): boolean {
  return password1 !== "" && password2 !== "" && password1 === password2;
}

export function verifyEmailsMatch(email1: string, email2: string): boolean {
  return email1 !== "" && email2 !== "" && email1.toLowerCase() === email2.toLowerCase();
}

export function verifyIsName(name: string): boolean {
  return name !== "" && /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u.test(name);
}

export function verifyIsUsername(name: string): boolean {
  return name !== "" && /^[-_a-zA-Z0-9]+$/.test(name);
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const strongCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
  const mediumCheck = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*\d))|((?=.*[A-Z])(?=.*\d)))(?=.{8,})/;
  const weakCheck = /^(?=.{8,})/;
  if (strongCheck.test(password)) {
    return PasswordStrength.strong;
  } else if (mediumCheck.test(password)) {
    return PasswordStrength.medium;
  } else if (weakCheck.test(password)) {
    return PasswordStrength.weak;
  }
  return PasswordStrength.fail;
}
