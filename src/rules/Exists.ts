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
  export class ExistsConstraint implements ValidatorConstraintInterface {

    constructor(@Inject("prisma") private prisma: PrismaClient) {}

    async validate(id: any, args: ValidationArguments) {
      let table: string = args.constraints[0]
      let task = await this.prisma[table].findUnique({
        where: {id: Number(id)}
      })
      return task != undefined;
    }
  }
  
  export function Exists(table: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [table],
        validator: ExistsConstraint,
      });
    };
  }