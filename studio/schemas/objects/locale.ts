import {defineField, defineType, defineArrayMember} from 'sanity'

/**
 * Localised field types. English is the only language that ships today.
 * French is present in every schema so it can be filled in later without a
 * migration. The French fieldset starts collapsed so Stephanie is not faced
 * with two of every field.
 */
export const languages: {id: 'en' | 'fr'; title: string; isDefault?: boolean}[] = [
  {id: 'en', title: 'English', isDefault: true},
  {id: 'fr', title: 'French'},
]

const localeFieldsets = [
  {name: 'translations', title: 'French version (optional, for later)', options: {collapsible: true, collapsed: true}},
]

function localeFields(fieldFactory: (lang: (typeof languages)[number]) => {type: string; rows?: number}) {
  return languages.map((lang) =>
    defineField({
      ...fieldFactory(lang),
      name: lang.id,
      title: lang.title,
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  )
}

export const localeString = defineType({
  name: 'localeString',
  title: 'Short text',
  type: 'object',
  fieldsets: localeFieldsets,
  fields: localeFields(() => ({type: 'string'})),
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Paragraph',
  type: 'object',
  fieldsets: localeFieldsets,
  fields: localeFields(() => ({type: 'text', rows: 4})),
})

export const localeBlock = defineType({
  name: 'localeBlock',
  title: 'Rich text',
  type: 'object',
  fieldsets: localeFieldsets,
  fields: localeFields(() => ({type: 'richText'})),
})

/** The rich text editor itself: headings, lists, links, and inline images. */
export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading', value: 'h2'},
        {title: 'Small heading', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullets', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          defineField({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Web address',
                type: 'url',
                description: 'Paste the full address, starting with https://. For a page on this site you can type the path, for example /work-with-me.',
                validation: (rule) => rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Photo',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Describe the photo',
          type: 'string',
          description: 'One sentence saying what is in the picture, for people who cannot see it and for Google. Example: "Stephanie seated in her practice room in Mapou."',
          validation: (rule) => rule.required().error('Every photo needs a description.'),
        }),
        defineField({name: 'caption', title: 'Caption (optional)', type: 'string'}),
      ],
    }),
  ],
})
