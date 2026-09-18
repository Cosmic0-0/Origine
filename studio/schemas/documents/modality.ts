import {defineField, defineType} from 'sanity'

export const modality = defineType({
  name: 'modality',
  title: 'Modality',
  type: 'document',
  description: 'The techniques a session can draw on: Access Bars, Reiki, breathwork, and so on.',
  fields: [
    defineField({name: 'title', title: 'Name', type: 'localeString', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'Web address ending', type: 'slug', options: {source: 'title.en', maxLength: 60}, validation: (rule) => rule.required()}),
    defineField({
      name: 'summary',
      title: 'In one or two sentences',
      type: 'localeText',
      description: 'Shown in lists and at the top of the modality page.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'body', title: 'Full explanation', type: 'localeBlock', description: 'What it is, where it comes from, what a session is like, who it helps.'}),
    defineField({
      name: 'where',
      title: 'Where',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: [{title: 'In person', value: 'inPerson'}, {title: 'Online', value: 'online'}]},
      initialValue: ['inPerson', 'online'],
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Usual length, in minutes',
      type: 'object',
      description: 'Optional. Only fill in if it differs from a normal session.',
      fields: [
        defineField({name: 'min', title: 'From', type: 'number'}),
        defineField({name: 'max', title: 'To', type: 'number'}),
      ],
    }),
    defineField({name: 'image', title: 'Photo', type: 'photo'}),
    defineField({name: 'relatedPost', title: 'Blog post to link to', type: 'reference', to: [{type: 'post'}], description: 'Optional. "Read more on the blog" link.'}),
    defineField({name: 'order', title: 'Position in lists', type: 'number', initialValue: 10}),
    defineField({name: 'seo', title: 'Search and sharing', type: 'seo'}),
  ],
  orderings: [{title: 'Position', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title.en', subtitle: 'summary.en', media: 'image'}},
})
