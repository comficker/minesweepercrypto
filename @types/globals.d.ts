declare module '*.gql' {
  import { DocumentNode } from 'graphql'
  const Schema: DocumentNode
  export = Schema
}
declare module '*.graphql' {
  import { DocumentNode } from 'graphql'
  const Schema: DocumentNode
  export = Schema
}


declare module 'vue3-smooth-dnd'

import { ReCaptchaInstance } from 'recaptcha-v3'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $recaptcha: (action: string) => Promise<string>
    $recaptchaLoaded: () => Promise<boolean>
    $recaptchaInstance: ReCaptchaInstance
    // $md: any
  }
}
