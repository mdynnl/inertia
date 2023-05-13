import { createInertiaApp } from '@inertiajs/solid'
import { render } from 'solid-js/web'
import { MetaProvider } from 'solid-meta'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
    return pages[`./Pages/${name}.tsx`]
  },
  setup({ el, App, props }) {
    render(
      () => (
        <MetaProvider>
          <App {...props} />
        </MetaProvider>
      ),
      el,
    )
  },
})
