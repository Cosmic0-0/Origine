import type {StructureResolver} from 'sanity/structure'

/** Fixed pages: one document each, cannot be duplicated or deleted from the list. */
export const fixedPages: {id: string; title: string; type: string}[] = [
  {id: 'homePage', title: 'Home', type: 'homePage'},
  {id: 'aboutPage', title: 'About', type: 'aboutPage'},
  {id: 'page-work', title: 'Work with me', type: 'page'},
  {id: 'page-groups', title: 'Groups and retreats', type: 'page'},
  {id: 'page-modalities', title: 'Modalities', type: 'page'},
  {id: 'page-blog', title: 'Blog', type: 'page'},
  {id: 'page-faq', title: 'FAQ', type: 'page'},
  {id: 'page-contact', title: 'Contact', type: 'page'},
  {id: 'page-privacy', title: 'Privacy', type: 'page'},
]

export const singletonTypes = new Set(['siteSettings', 'homePage', 'aboutPage', 'page'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Your website')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items(
              fixedPages.map((p) =>
                S.listItem().title(p.title).id(p.id).child(S.document().schemaType(p.type).documentId(p.id).title(p.title)),
              ),
            ),
        ),
      S.divider(),
      S.documentTypeListItem('service').title('Offers and prices'),
      S.documentTypeListItem('event').title('Events and dates'),
      S.documentTypeListItem('modality').title('Modalities'),
      S.divider(),
      S.documentTypeListItem('post').title('Blog posts'),
      S.documentTypeListItem('faqEntry').title('FAQ questions'),
      S.documentTypeListItem('testimonial').title('Client quotes'),
      S.divider(),
      S.listItem()
        .title('Contact details and links')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Contact details and links')),
    ])
