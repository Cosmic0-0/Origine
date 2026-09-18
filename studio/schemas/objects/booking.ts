import {defineField, defineType} from 'sanity'

/**
 * How a visitor books this. Kept as its own object so an online-payment
 * option can be added later without touching the documents that use it.
 */
export const booking = defineType({
  name: 'booking',
  title: 'How people book',
  type: 'object',
  fields: [
    defineField({
      name: 'mode',
      title: 'Booking button does what?',
      type: 'string',
      initialValue: 'calendly',
      options: {
        layout: 'radio',
        list: [
          {title: 'Opens my Calendly (book a time straight away)', value: 'calendly'},
          {title: 'Opens the enquiry form (they write to me first)', value: 'enquire'},
          {title: 'Opens another web address (for example YouTube or a payment link)', value: 'link'},
          {title: 'No button', value: 'none'},
        ],
      },
    }),
    defineField({
      name: 'url',
      title: 'Web address',
      type: 'url',
      description: 'Only needed for "Opens another web address".',
      hidden: ({parent}) => parent?.mode !== 'link',
    }),
    defineField({
      name: 'label',
      title: 'Button text',
      type: 'localeString',
      description: 'Leave empty for the standard wording ("Book a session", "Enquire").',
    }),
  ],
})
