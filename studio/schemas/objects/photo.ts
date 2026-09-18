import {defineField, defineType} from 'sanity'

/** An image that always carries a description, so nothing ships without alt text. */
export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Describe the photo',
      type: 'string',
      description: 'One sentence saying what is in the picture, for people who cannot see it and for Google.',
      validation: (rule) => rule.required().error('Every photo needs a description.'),
    }),
  ],
})
