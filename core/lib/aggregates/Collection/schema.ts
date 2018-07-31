import Joi, {committer} from '../../joi'

export const create = Joi.object()
  .required()
  .keys({
    username: Joi.string().required(),
    name: Joi.string().required(),
  })

export const update = Joi.object()
  .required()
  .keys({
    name: Joi.string().optional(),
  })
