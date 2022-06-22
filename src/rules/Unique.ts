import { PrismaClient } from '@prisma/client';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
import { Inject, Service } from 'typedi';
 
  @Service()
  @ValidatorConstraint({ async: true })
  export class UniqueConstraint implements ValidatorConstraintInterface {

    constructor(@Inject("prisma") private prisma: PrismaClient) {}

    async validate(value: any, args: ValidationArguments) {
      let table: string = args.constraints[0]
      let field: string = args.constraints[1]
      let where = {}
      where[field] = value

      let model = await this.prisma[table].findUnique({
        where
      })
      return model == undefined;
    }
  }
  
  export function Unique(table: string, field: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [table, field],
        validator: UniqueConstraint,
      });
    };
  }