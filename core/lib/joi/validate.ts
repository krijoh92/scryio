import Joi from './joi'

export default function validate<T>(joiSchema: any, options?: any) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value
    descriptor.value = async function(this: void, args: any) {
      const props = await Joi.validate(args, joiSchema, {stripUnknown: true, ...options})
      return method.call(this, props)
    }
  }
}
