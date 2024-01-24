import { Validations } from './validations';
import { BadRequestException } from '@nestjs/common';

export class NameValidate {
  private static instance: NameValidate;
  public static getInstance(): NameValidate {
    if (!NameValidate.instance) {
      NameValidate.instance = new NameValidate();
    }
    return NameValidate.instance;
  }
  private IS_NUMBER = /\d/;
  private IS_EMAIL = /^[a-zA-Z0-9._%+-]{1,50}@[a-zA-Z0-9.-]{2,26}\.[a-zA-Z]{2,13}(\.[a-zA-Z]{2,13})?$/;
  private IS_PHONE_NUMBER = /^\d{11}$/;
  private NO_SPACE = /\s+/;
  private NO_SPECIAL_CHARACTER = /[!@#$?/*+&_,:;=%|'<>.^(){}~çãªº°´`¨¹²³£¢¬§\(\)\/\\\[\]\^\|\{\}-]/;
  private ESPECIAL_CHARACTER = /[!@#$?/*+]/;
  private OTHER_ESPECIAL_CHARACTER = /[&_,:;=%|ç'<>.^(){}~¨´`ã¹²³£¢¬§°ªº\(\)\/\\\[\]\^\|\{\}-]/;
  private NO_UPPER = /[A-Z]/;
  private NO_ACENTUATION = /[`áàãâéêíóôõúüÁÀÃÂÉÊÍÓÔÕÚÜÇ´¨]/;
 

  getValidName(name: string) {
    let currentName = name;

    currentName = currentName.replace(/\s+/g, ' ');

    Validations.getInstance().verifyLength('nome', currentName, 5, 40);

    if (this.validate(this.NO_SPECIAL_CHARACTER, currentName)) {
      throw new BadRequestException(
        'O nome do usuario não pode conter caracteres especiais!!',
      );
    }
    if (this.validate(this.OTHER_ESPECIAL_CHARACTER, currentName)) {
      throw new BadRequestException(
        'O nome do usuario não pode conter caracteres especiais!!',
      );
    }
    if (this.validate(this.IS_NUMBER, currentName)) {
      throw new BadRequestException(
        'O nome do usuario não pode conter números!!',
      );
    }
    if (this.validate(this.NO_ACENTUATION, currentName)) {
      throw new BadRequestException(
        'O nome do usuario não pode conter acentuação!!',
      );
    }
    const treatment = name.split(' ');
    let standard_name = '';
    treatment.forEach((name) => {
      name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      standard_name += name + ' ';
    });
    standard_name = standard_name.slice(0, standard_name.length - 1);

    return standard_name;
  }

  getValidPassword(password: string) {
    if (!(password.length >= 5 && password.length <= 10)) {
      throw new BadRequestException(
        'A senha deve ter mínimo 5 e máximo 10 caracteres!',
      );
    }
    if (this.validate(this.NO_SPACE, password)) {
      throw new BadRequestException('A senha não deve possuir espaços!');
    }
    return password;
  }

  getValidEmail(email: string) {
    if (!this.validate(this.IS_EMAIL, email)) {
      throw new BadRequestException('Digite um email válido!');
    }
    if (this.validate(this.NO_UPPER, email)) {
      throw new BadRequestException('O email não pode conter letras maiúsculas!');
    }

    return email;
  }

  getValidPhone(phone: string) {
    if (!this.validate(this.IS_PHONE_NUMBER, phone)) {
      throw new BadRequestException('Número de celular inválido!');
    }

    return phone;
  }

  private validate(regex: RegExp, value: string): boolean {
    return regex.test(value);
  }
}
