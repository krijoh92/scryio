import Joi from './joi'
import validate from './validate'

// standard joi types
export const committer = Joi.string()
  .optional()
  .default('system')

export const email = Joi.string()
  .email()
  .lowercase()
  .optional()
  .allow(null)
  .allow('')

export const address = Joi.object().keys({
  streetName: Joi.string().required(),
  postalCode: Joi.string()
    .required()
    .min(4)
    .max(4),
  postalArea: Joi.string().required(),
})

export {validate}
export default Joi
