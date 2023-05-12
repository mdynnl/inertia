import { PageProps, router } from '@inertiajs/core'
import { createComponent, createMemo, createSignal, mergeProps, ParentProps } from 'solid-js'
import { SetupOptions } from './createInertiaApp'
import { PageContext } from './PageContext'

export default function App(props: ParentProps<SetupOptions<unknown, PageProps>['props']>) {
  const { initialPage, initialComponent, resolveComponent } = props
  const [current, setCurrent] = createSignal({
    component: initialComponent || null,
    page: initialPage,
    key: null,
  })

  router.init({
    initialPage,
    resolveComponent,
    swapComponent: async ({ component, page, preserveState }) => {
      setCurrent(
        (current) =>
          ({
            component,
            page,
            key: preserveState ? current.key : Date.now(),
          } as typeof current),
      )
    },
  })

  return createComponent(PageContext.Provider, {
    value: mergeProps(() => current().page),
    get children() {
      const component = createMemo(() => current().component)
      return createMemo(() => {
        if (!component()) return null

        const children =
          (props.children as any) ||
          ((Component, props) => {
            const child = createComponent(Component, props)

            if (typeof Component.layout === 'function') {
              return Component.layout(child)
            }

            if (Array.isArray(Component.layout)) {
              return Component.layout
                .concat(child)
                .reverse()
                .reduce((children, Layout) => createComponent(Layout, mergeProps({ children }, props)))
            }

            return child
          })

        return children(
          component(),
          mergeProps(() => current().page.props),
        )
      }) as unknown as Element
    },
  })
}
