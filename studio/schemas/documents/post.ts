import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'localeString', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'Web address ending', type: 'slug', options: {source: 'title.en', maxLength: 80}, validation: (rule) => rule.required()}),
    defineField({name: 'publishedAt', title: 'Date', type: 'datetime', validation: (rule) => rule.required(), initialValue: () => new Date().toISOString()}),
    defineField({name: 'excerpt', title: 'Summary', type: 'localeText', description: 'One or two sentences shown in the blog list and in Google.', validation: (rule) => rule.required()}),
    defineField({name: 'coverImage', title: 'Cover photo', type: 'photo'}),
    defineField({name: 'body', title: 'The post', type: 'localeBlock', validation: (rule) => rule.required()}),
    defineField({name: 'relatedModality', title: 'Related modality (optional)', type: 'reference', to: [{type: 'modality'}], description: 'Adds a "Book this" link at the end of the post.'}),
    defineField({name: 'seo', title: 'Search and sharing', type: 'seo'}),
  ],
  orderings: [{title: 'Newest first', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'title.en', date: 'publishedAt', media: 'coverImage'},
    prepare: ({title, date, media}) => ({title, subtitle: date ? new Date(date).toLocaleDateString('en-GB', {dateStyle: 'long'}) : '', media}),
  },
})
