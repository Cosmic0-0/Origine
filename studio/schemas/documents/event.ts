import {defineField, defineType} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event or date',
  type: 'document',
  description: 'A dated thing: the next Moonlight Meditation, a circle, a workshop, a retreat.',
  fields: [
    defineField({name: 'title', title: 'Name', type: 'localeString', validation: (rule) => rule.required(), description: 'For example "Moonlight Meditation, October".'}),
    defineField({name: 'slug', title: 'Web address ending', type: 'slug', options: {source: 'title.en', maxLength: 60}, validation: (rule) => rule.required()}),
    defineField({
      name: 'offer',
      title: 'Which offer is this a date for?',
      type: 'reference',
      to: [{type: 'service'}],
      description: 'Pick Moonlight Meditation, a retreat, a workshop. The price and description come from there unless you override them below.',
    }),
    defineField({name: 'start', title: 'Starts', type: 'datetime', validation: (rule) => rule.required(), options: {timeStep: 15}}),
    defineField({name: 'end', title: 'Ends', type: 'datetime', description: 'Optional. For a retreat, the last day.', options: {timeStep: 15}}),
    defineField({name: 'location', title: 'Where', type: 'localeString', description: 'For example "Domaine de Labourdonnais, Mapou" or "Online, link sent by email".'}),
    defineField({name: 'price', title: 'Price for this date (optional)', type: 'price', description: 'Leave empty to use the offer\'s usual price.'}),
    defineField({name: 'description', title: 'About this date', type: 'localeBlock', description: 'Optional. Anything specific to this one: theme, what to bring, who it is for.'}),
    defineField({name: 'booking', title: 'How people book', type: 'booking'}),
    defineField({name: 'spaces', title: 'Spaces left (optional)', type: 'number', description: 'Shown as "3 places left". Leave empty to say nothing.'}),
    defineField({name: 'soldOut', title: 'Fully booked', type: 'boolean', initialValue: false}),
    defineField({name: 'image', title: 'Photo', type: 'photo'}),
  ],
  orderings: [{title: 'Date', name: 'start', by: [{field: 'start', direction: 'asc'}]}],
  preview: {
    select: {title: 'title.en', start: 'start', soldOut: 'soldOut', media: 'image'},
    prepare: ({title, start, soldOut, media}) => ({
      title,
      subtitle: [start ? new Date(start).toLocaleString('en-GB', {dateStyle: 'medium', timeStyle: 'short'}) : 'no date', soldOut ? 'fully booked' : null].filter(Boolean).join(' · '),
      media,
    }),
  },
})
