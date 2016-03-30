import {Control} from "angular2/common";

interface ValidationResult{
    [key:string]:boolean;
}

export class CustomValidator {

    static isNotNumber(control: Control): ValidationResult {

        if (isNaN(Number(control.value))) {
            return {"isNotNumber": true};
        }

        return null;
    }

    static isNotEmail(control: Control): ValidationResult {

        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (!EMAIL_REGEXP.test(control.value)) {
            return {"isNotEmail": true};
        }

        return null;
    }

    static isNotCountryCodeTel(control: Control): ValidationResult {

        if (isNaN(Number(control.value))) {
            console.log('isnotcountrycode true');

            return {"isNotCountryCodeTel": true};
        }

        console.log('isnotcountrycode false');
        return null;
    }

}