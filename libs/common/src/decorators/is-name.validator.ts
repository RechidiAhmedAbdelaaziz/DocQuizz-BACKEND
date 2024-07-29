import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    isString,
    isAlpha,
} from 'class-validator';



@ValidatorConstraint({ async: true })
class IsNameConstraint implements ValidatorConstraintInterface {
    validate(userName: any, args: ValidationArguments) {
        const isValid = isString(userName);
        if (!isValid) return false;

        const name = userName.replace(/\s/g, '');
        return isAlpha(name) 
    }
}

export function IsName(
    validationOptions: ValidationOptions = {
        message: 'Name must contain only letters'
    }) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNameConstraint,
        });
    };
}