import Joi, {committer} from 'lib/joi'

export const create = Joi.object()
  .required()
  .keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    releaseDate: Joi.date().optional(),
    type: Joi.string().optional(),
    block: Joi.string().optional(),
    parentCode: Joi.string().optional(),
    cardCount: Joi.number().required(),
    iconSvg: Joi.string().required()
  })
