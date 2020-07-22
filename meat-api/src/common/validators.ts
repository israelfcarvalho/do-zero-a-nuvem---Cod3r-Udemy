import { toNumber } from "./utils";

export function emailValidator(email: string) {
  return RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ).test(email);
}

export function valueLengthValidator(minLength?: number, maxLength?: number) {
  const _minLength = minLength && minLength >= 0 ? minLength : 0;
  const _maxLength =
    maxLength && maxLength >= _minLength ? maxLength : undefined;

  return function (value: string) {
    if (!_maxLength) {
      return value.length >= _minLength;
    }

    return value.length >= _minLength && value.length <= _maxLength;
  };
}

export const GENDERS = ["Female", "Male"];

export function validatorGender(gender: string) {
  return GENDERS.includes(gender);
}

export function validatorCPF(cpf: string) {
  const cpfNumber = toNumber(cpf);

  let sum: number = 0;
  let rest;

  if (cpfNumber === "00000000000") {
    return false;
  }

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfNumber.substring(i - 1, i)) * (11 - i);
  }

  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) {
    rest = 0;
  }

  if (rest != parseInt(cpfNumber.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpfNumber.substring(i - 1, i)) * (12 - i);
  }

  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) {
    rest = 0;
  }

  if (rest != parseInt(cpfNumber.substring(10, 11))) {
    return false;
  }
  return true;
}
