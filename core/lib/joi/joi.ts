import Joi from 'joi'
import {checklistStatus} from './types'

const extensions = [checklistStatus]

export default Joi.extend(extensions)
