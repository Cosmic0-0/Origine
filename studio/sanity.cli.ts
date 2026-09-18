import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // The hostname of the hosted Studio, e.g. origine-healing.sanity.studio
  studioHost: process.env.SANITY_STUDIO_HOST || 'origine-healing',
  autoUpdates: true,
})
