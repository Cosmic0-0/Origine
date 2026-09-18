import {defineField, defineType} from 'sanity'

export const faqEntry = defineType({
  name: 'faqEntry',
  title: 'FAQ question',
  type: 'document',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'localeString', validation: (rule) => rule.required()}),
    defineField({name: 'answer', title: 'Answer', type: 'localeBlock', validation: (rule) => rule.required()}),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      description: 'Groups the questions on the FAQ page.',
      options: {list: [
        {title: 'About the work', value: 'about'},
        {title: 'Sessions and what to expect', value: 'sessions'},
        {title: 'Booking, prices and policies', value: 'booking'},
      ]},
      initialValue: 'about',
    }),
    defineField({name: 'order', title: 'Position in list', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'Position', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'question.en', subtitle: 'topic'}},
})
