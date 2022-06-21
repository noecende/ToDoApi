import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
import { Service } from 'typedi';
import { PrismaService } from '../singletons/PrismaService';
 
  @Service()
  @ValidatorConstraint({ async: true })
  export class ExistsConstraint implements ValidatorConstraintInterface {

    constructor(private prismaService: PrismaService) {}
     
    
    async validate(id: any, args: ValidationArguments) {
      let task = await this.prismaService.prisma.task.findUnique({
        where: {id: Number(id)}
      })
      return task != undefined;
    }
  }
  
  export function Exists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: ExistsConstraint,
      });
    };
  }