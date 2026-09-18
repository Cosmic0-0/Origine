import {defineField, defineType, defineArrayMember} from 'sanity'

/** The home page: everything on it that is not pulled from offers, quotes or events. */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'top', title: 'Top of page', default: true},
    {name: 'middle', title: 'Middle sections'},
    {name: 'bottom', title: 'Bottom of page'},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    defineField({name: 'heroHeading', title: 'Big headline', type: 'localeString', group: 'top', description: 'Six to eight words. This is the first thing people read.', validation: (rule) => rule.required()}),
    defineField({name: 'heroLede', title: 'Sentence under the headline', type: 'localeText', group: 'top'}),
    defineField({name: 'heroImage', title: 'Main photo', type: 'photo', group: 'top'}),
    defineField({name: 'credentialsLine', title: 'Your background in one line', type: 'localeText', group: 'top', description: 'The clinical and the spiritual, together. Shown near the top so sceptical readers see it early.'}),
    defineField({name: 'statement', title: 'Your quote', type: 'localeText', group: 'middle', description: 'The "Healing is not about fixing what is broken" line, or whatever you want to lead with.'}),
    defineField({name: 'originMeaning', title: 'What Origine means', type: 'localeText', group: 'middle'}),
    defineField({name: 'whoHeading', title: '"Who this is for" heading', type: 'localeString', group: 'middle'}),
    defineField({name: 'whoBody', title: '"Who this is for" text', type: 'localeBlock', group: 'middle'}),
    defineField({name: 'quoteImage', title: 'Photo beside the client quote', type: 'photo', group: 'middle'}),
    defineField({name: 'trainingHeading', title: 'Training section heading', type: 'localeString', group: 'middle', description: 'For example "The clinical came first."'}),
    defineField({name: 'moonHeading', title: 'Moonlight Meditation heading', type: 'localeString', group: 'bottom'}),
    defineField({name: 'moonBody', title: 'Moonlight Meditation text', type: 'localeText', group: 'bottom'}),
    defineField({name: 'closingHeading', title: 'Closing heading', type: 'localeString', group: 'bottom', description: 'For example "Start with one session."'}),
    defineField({name: 'closingBody', title: 'Closing text', type: 'localeText', group: 'bottom'}),
    defineField({name: 'closingImage', title: 'Photo beside the closing section', type: 'photo', group: 'bottom'}),
    defineField({name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
})

/** About Stephanie: story, training and the philosophy of Origine on one page. */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  groups: [
    {name: 'top', title: 'Top of page', default: true},
    {name: 'story', title: 'Your story'},
    {name: 'training', title: 'Training'},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    defineField({name: 'heading', title: 'Headline', type: 'localeString', group: 'top', validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Introduction', type: 'localeText', group: 'top', description: 'Two or three sentences. Lead with the clinical background.'}),
    defineField({name: 'portrait', title: 'Portrait photo', type: 'photo', group: 'top'}),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'story',
      description: 'Your story in parts: "A different approach", "My path", "How I work", "Beyond my professional life", and so on. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'localeString', validation: (rule) => rule.required()}),
            defineField({name: 'body', title: 'Text', type: 'localeBlock', validation: (rule) => rule.required()}),
            defineField({name: 'image', title: 'Photo (optional)', type: 'photo'}),
          ],
          preview: {select: {title: 'heading.en', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'training',
      title: 'Training, in the order it happened',
      type: 'array',
      group: 'training',
      description: 'One line each. Shown as a list on the About page and the home page.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trainingItem',
          fields: [
            defineField({name: 'label', title: 'Training', type: 'localeString', validation: (rule) => rule.required()}),
            defineField({name: 'detail', title: 'Detail (optional)', type: 'localeString', description: 'For example "more than twenty years".'}),
            defineField({name: 'highlight', title: 'Emphasise this one', type: 'boolean', initialValue: false}),
          ],
          preview: {select: {title: 'label.en', subtitle: 'detail.en'}},
        }),
      ],
    }),
    defineField({name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'About page'})},
})

/** Simple pages that share one shape. Their IDs are fixed in structure.ts so they cannot be deleted or duplicated. */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Headline', type: 'localeString', validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Introduction', type: 'localeText', description: 'Optional. One or two sentences under the headline.'}),
    defineField({name: 'body', title: 'Text', type: 'localeBlock', description: 'Optional. The main text of the page, if it has one.'}),
    defineField({name: 'image', title: 'Photo (optional)', type: 'photo'}),
    defineField({name: 'seo', title: 'Search and sharing', type: 'seo'}),
  ],
  preview: {select: {title: 'title.en'}},
})
