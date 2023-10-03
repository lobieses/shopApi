import { registerDecorator } from 'class-validator';

const AVAILABLE_DECIMAL_PLACES = 2;
const CENTS_IN_DOLLAR = 100;

export const IsValidPrice = (minCost = 1): PropertyDecorator => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidPrice',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `Currency must be an string integer and greater than ${minCost} and have max ${AVAILABLE_DECIMAL_PLACES} decimals places`,
      },
      validator: {
        validate(price: string) {
          if (typeof price !== 'string' || typeof +price !== 'number')
            return false;

          const valueDecimalPlaces: string | undefined = price.split('.')[1];
          return (
            +price >= minCost &&
            (valueDecimalPlaces === undefined ||
              (valueDecimalPlaces.length <= AVAILABLE_DECIMAL_PLACES &&
                +valueDecimalPlaces < CENTS_IN_DOLLAR))
          );
        },
      },
    });
  };
};
