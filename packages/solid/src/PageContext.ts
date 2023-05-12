import { Page, PageProps } from '@inertiajs/core'
import { createContext, useContext } from 'solid-js'

export const PageContext = createContext()

export function usePage<TPageProps extends PageProps = PageProps>(): Page<TPageProps> {
  const page = useContext(PageContext) as any

  if (!page) {
    throw new Error('usePage must be used within the Inertia component')
  }

  return page
}
