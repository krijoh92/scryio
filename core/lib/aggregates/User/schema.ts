import Joi, {committer} from 'lib/joi'

const userSchema = {
  committer,
  email: Joi.string()
    .email()
    .lowercase()
    .optional()
    .allow(null)
    .allow(''),
  password: Joi.string().required(),
}

export const create = Joi.object()
  .required()
  .keys({
    username: Joi.string().required(),
    ...userSchema,
  })

export const update = Joi.object()
  .required()
  .keys({
    ...userSchema,
  })
