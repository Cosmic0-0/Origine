import {defineField, defineType} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Client quote',
  type: 'document',
  fields: [
    defineField({name: 'quote', title: 'What they said', type: 'localeText', validation: (rule) => rule.required()}),
    defineField({name: 'name', title: 'Name to show', type: 'string', description: 'As they agreed to be shown: first name, initials, or "Anonymous".', validation: (rule) => rule.required()}),
    defineField({name: 'context', title: 'What they came for (optional)', type: 'localeString', description: 'For example "Access Bars" or "Three-month programme". Shown under the name.'}),
    defineField({name: 'featured', title: 'Show on the home page', type: 'boolean', initialValue: false}),
    defineField({name: 'order', title: 'Position in list', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'Position', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {quote: 'quote.en', name: 'name', featured: 'featured'},
    prepare: ({quote, name, featured}) => ({title: name, subtitle: `${featured ? 'On home page · ' : ''}${(quote || '').slice(0, 80)}`}),
  },
})
