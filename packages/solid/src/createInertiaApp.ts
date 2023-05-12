import { Page, PageProps, PageResolver, setupProgress } from '@inertiajs/core'
import { Component } from 'solid-js'
import { ssrElement } from 'solid-js/web'
import App from './App'

type HeadManagerOnUpdate = (elements: string[]) => void // TODO: When shipped, replace with: Inertia.HeadManagerOnUpdate
type HeadManagerTitleCallback = (title: string) => string // TODO: When shipped, replace with: Inertia.HeadManagerTitleCallback

type AppType<SharedProps extends PageProps = PageProps> = Component<
  {
    children?: (props: { Component: Component; props: Page<SharedProps>['props'] }) => Component
  } & SetupOptions<unknown, SharedProps>['props']
>

export type SetupOptions<ElementType, SharedProps extends PageProps> = {
  el: ElementType
  App: AppType
  props: {
    initialPage: Page<SharedProps>
    initialComponent: Component
    resolveComponent: PageResolver
    titleCallback?: HeadManagerTitleCallback
    onHeadUpdate?: HeadManagerOnUpdate
  }
}

type BaseInertiaAppOptions = {
  title?: HeadManagerTitleCallback
  resolve: PageResolver
}

type CreateInertiaAppSetupReturnType = Component | void
type InertiaAppOptionsForCSR<SharedProps extends PageProps> = BaseInertiaAppOptions & {
  id?: string
  page?: Page | string
  render?: typeof import('solid-js/web').renderToString
  progress?:
    | false
    | {
        delay?: number
        color?: string
        includeCSS?: boolean
        showSpinner?: boolean
      }
  setup(options: SetupOptions<HTMLElement, SharedProps>): CreateInertiaAppSetupReturnType
}

type CreateInertiaAppSSRContent = { head: string[]; body: string }
type InertiaAppOptionsForSSR<SharedProps extends PageProps> = BaseInertiaAppOptions & {
  id?: undefined
  page: Page | string
  render: any
  progress?: undefined
  setup(options: SetupOptions<null, SharedProps>): Component | void /* ReactInstance */
}

export async function createInertiaApp<SharedProps extends PageProps = PageProps>(
  options: InertiaAppOptionsForCSR<SharedProps>,
): Promise<CreateInertiaAppSetupReturnType>
export async function createInertiaApp<SharedProps extends PageProps = PageProps>(
  options: InertiaAppOptionsForSSR<SharedProps>,
): Promise<CreateInertiaAppSSRContent>
export async function createInertiaApp<SharedProps extends PageProps = PageProps>({
  id = 'app',
  resolve,
  setup,
  title,
  progress = {},
  page,
  render,
}: InertiaAppOptionsForCSR<SharedProps> | InertiaAppOptionsForSSR<SharedProps>): Promise<
  CreateInertiaAppSetupReturnType | CreateInertiaAppSSRContent
> {
  const isServer = typeof window === 'undefined'
  const el = isServer ? null : document.getElementById(id)
  const initialPage = page || JSON.parse(el.dataset.page)
  // @ts-expect-error
  const resolveComponent = (name) => Promise.resolve(resolve(name)).then((module) => module.default || module)

  let head = []

  const solidApp = await resolveComponent(initialPage.component).then((initialComponent) => {
    return setup({
      // @ts-expect-error
      el,
      App,
      props: {
        initialPage,
        initialComponent,
        resolveComponent,
      },
    })
  })

  if (!isServer && progress) {
    setupProgress(progress)
  }

  if (isServer) {
    const body = await render(
      ssrElement(
        'div',
        {
          id,
          'data-page': JSON.stringify(initialPage),
        },
        solidApp,
        false,
      ),
    )

    return { head, body }
  }
}
