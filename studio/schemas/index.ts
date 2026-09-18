import {localeString, localeText, localeBlock, richText} from './objects/locale'
import {seo} from './objects/seo'
import {photo} from './objects/photo'
import {price} from './objects/price'
import {booking} from './objects/booking'
import {siteSettings} from './documents/siteSettings'
import {service} from './documents/service'
import {modality} from './documents/modality'
import {event} from './documents/event'
import {post} from './documents/post'
import {faqEntry} from './documents/faqEntry'
import {testimonial} from './documents/testimonial'
import {homePage, aboutPage, page} from './documents/pages'

export const schemaTypes = [
  // objects
  localeString, localeText, localeBlock, richText, seo, photo, price, booking,
  // documents
  siteSettings, homePage, aboutPage, page, service, modality, event, post, faqEntry, testimonial,
]
