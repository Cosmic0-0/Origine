import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {structure, singletonTypes} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error('Set SANITY_STUDIO_PROJECT_ID in studio/.env (see .env.example).')
}

export default defineConfig({
  name: 'origine',
  title: 'Origine Healing',
  projectId,
  dataset,
  // Vision runs GROQ queries by hand. Useful in `sanity dev`, noise in the Studio Stephanie sees.
  plugins: [structureTool({structure}), ...(process.env.NODE_ENV === 'development' ? [visionTool()] : [])],
  schema: {
    types: schemaTypes,
    // Fixed pages and settings are created from the structure, never from the "new document" menu.
    templates: (templates) => templates.filter((t) => !singletonTypes.has(t.schemaType)),
  },
  document: {
    // No "duplicate" or "delete" on the fixed pages and settings.
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
