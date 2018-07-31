import {format as formatDate} from 'date-fns'
import locale from 'date-fns/locale/nb'

export default function(date: Date | string | number, format: string = 'DD.MM.YYYY'): string {
  return date ? formatDate(date, format, {locale}) : null
}
