import { BadRequestException } from "@nestjs/common"
import { ValidType } from "./Enum";


export class Validations {

    private static instance: Validations

    public static getInstance(): Validations {
        
        if (!Validations.instance) {
            Validations.instance = new Validations();
        }
        return Validations.instance;
    }

    private IS_NUMBER = /[a-zA-Z!@#$%^&*()/,.?":{}|<>]/gm;
    private IS_STRING = /[\d]/g;
    private NO_SPACE = /\s+/g;
    private NO_MANY_SPACE = /\s +/g;
    private NO_SPECIAL_CHARACTER = /[!@#$%^&*(),.?"/:{}|<>-]/g;

    validateWithRegex(field: string, type: string, value: string, min: number = null, max: number = null, space?: any) {

        switch (type) {

            case ValidType.IS_ALPHABETIC:
                if (this.validRegex(this.IS_STRING, value) || this.validRegex(this.NO_SPECIAL_CHARACTER, value)) {
                    throw new BadRequestException(`Campo ${field} deve conter somente caracteres alfabéticos!`);
                }
                break;

            case ValidType.IS_NUMERIC:
                if (this.validRegex(this.IS_NUMBER, value) || this.validRegex(this.NO_SPECIAL_CHARACTER, value)) {
                    throw new BadRequestException(`Campo ${field} deve conter somente caracteres numéricos!`);
                }
                break;

            case ValidType.IS_ALPHANUMERIC:
                if (this.validRegex(this.NO_SPECIAL_CHARACTER, value)) {
                    throw new BadRequestException(`Campo ${field} deve conter somente caracteres alfanuméricos!`);
                }
                break;

            default:
                break;

        }

        if (space) {
            if (space?.NO_SPACE) {
                if (this.validRegex(this.NO_SPACE, value)) {
                    throw new BadRequestException(`Campo ${field} não deve conter espaços em branco!`);
                }
            }

            if(space?.NO_MANY_SPACE) {
                if (this.validRegex(this.NO_MANY_SPACE, value)) {
                    throw new BadRequestException(`Campo ${field} não deve conter 2 ou mais espaços em branco!`);
                }
            }
        }

        this.verifyLength(field, value, min, max);
    }

    verifyLength(field: string, value: string,  min: number = null, max: number = null) {

        if (value.length < min || value.length > max) {
            throw new BadRequestException(`Campo ${field} deve possuir no mínimo ${min} e no máximo ${max} caracteres!`);
        }
    }


    validRegex(regex: RegExp, value: string): boolean {
        return regex.test(value);
    }

}