import { PageProps, router } from '@inertiajs/core'
import { mergeProps, ParentProps } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { createComponent, isServer } from 'solid-js/web'
import { SetupOptions } from './createInertiaApp'
import { PageContext } from './PageContext'

export default function App(props: ParentProps<SetupOptions<unknown, PageProps>['props']>) {
  const { initialPage, initialComponent, resolveComponent } = props
  const [current, setCurrent] = createStore({
    component: initialComponent || null,
    layout: [],
    page: initialPage,
    key: null,
  })

  isServer ||
    router.init({
      initialPage,
      resolveComponent,
      swapComponent: async ({ component, page, preserveState }) => {
        setCurrent(
          reconcile({
            component,
            page,
            layout: [(component as any).layout].flat(),
            key: preserveState ? current.key : Date.now(),
          } as typeof current),
        )
      },
    })

  return createComponent(PageContext.Provider, {
    get value() {
      return current.page
    },
    get children() {
      return (function next(i = 0, layout = current.layout[i]) {
        return createComponent(
          layout ?? current.component,
          mergeProps(
            () => current.page.props,
            layout
              ? {
                  get children() {
                    return next(i + 1)
                  },
                }
              : null,
          ),
        )
      })()
    },
  })
}
