import Joi from 'joi'

export default {
  name: 'checklistStatus',
  base: Joi.string().valid('TODO', 'OK', 'DEVIATION', 'IRRELEVANT'),
}
