import {defineField, defineType} from 'sanity'

export const price = defineType({
  name: 'price',
  title: 'Price',
  type: 'object',
  fields: [
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      description: 'Numbers only, for example 3000. Leave empty if the price is not published.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'MUR',
      options: {list: [{title: 'Mauritian rupees (Rs)', value: 'MUR'}, {title: 'Euros', value: 'EUR'}, {title: 'US dollars', value: 'USD'}]},
    }),
    defineField({
      name: 'note',
      title: 'Note next to the price',
      type: 'localeString',
      description: 'Optional. For example "Payment plans available" or "Price depends on the retreat".',
    }),
  ],
})
