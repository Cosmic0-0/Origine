import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'Search engine and sharing settings',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Title shown in Google',
      type: 'localeString',
      description: 'Leave empty to use the page title. Keep under 60 characters.',
    }),
    defineField({
      name: 'description',
      title: 'Description shown in Google',
      type: 'localeText',
      description: 'One or two sentences, up to 155 characters. Leave empty to use the page introduction.',
    }),
    defineField({
      name: 'image',
      title: 'Sharing image',
      type: 'image',
      description: 'Shown when the page is shared on WhatsApp, Facebook or Instagram. Leave empty to use the site default.',
      options: {hotspot: true},
    }),
  ],
})
