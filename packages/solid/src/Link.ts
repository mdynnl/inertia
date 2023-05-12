import {
  FormDataConvertible,
  mergeDataIntoQueryString,
  Method,
  PreserveStateOption,
  Progress,
  router,
  shouldIntercept,
} from '@inertiajs/core'
import { Component, ComponentProps, createComponent, createEffect, JSX, mergeProps, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

const noop = () => undefined

type MapEvent<N, E extends Event> = Parameters<JSX.EventHandler<N, E>>[number]

interface BaseInertiaLinkProps {
  as?: string
  data?: Record<string, FormDataConvertible>
  href: string
  method?: Method
  headers?: Record<string, string>
  onClick?: (event: MapEvent<HTMLAnchorElement, KeyboardEvent> | MapEvent<HTMLAnchorElement, MouseEvent>) => void
  preserveScroll?: PreserveStateOption
  preserveState?: PreserveStateOption
  replace?: boolean
  only?: string[]
  onCancelToken?: (cancelToken: import('axios').CancelTokenSource) => void
  onBefore?: () => void
  onStart?: () => void
  onProgress?: (progress: Progress) => void
  onFinish?: () => void
  onCancel?: () => void
  onSuccess?: () => void
  onError?: () => void
  queryStringArrayFormat?: 'indices' | 'brackets'
}

export type InertiaLinkProps = BaseInertiaLinkProps & ComponentProps<'a'>

type InertiaLink = Component<InertiaLinkProps>

export const Link: InertiaLink = (props) => {
  const defaults = mergeProps(
    {
      as: 'a',
      data: {},
      method: 'get',
    },
    props,
  )

  const normalized = mergeProps(defaults, {
    get as() {
      return defaults.as.toLowerCase()
    },
    get method() {
      return defaults.method.toLowerCase() as Method
    },
  })

  const mapped = mergeProps(
    normalized,
    {
      get preserveState() {
        return normalized.method !== 'get'
      },
    },
    () => {
      const [href, data] = mergeDataIntoQueryString(
        normalized.method,
        defaults.href || '',
        defaults.data,
        defaults.queryStringArrayFormat,
      )
      return { href, data }
    },
  )

  const [, routerProps, rest] = splitProps(
    mapped,
    ['as', 'onClick', 'queryStringArrayFormat', 'href'],
    [
      'data',
      'method',
      'preserveScroll',
      'preserveState',
      'replace',
      'only',
      'headers',
      'onCancelToken',
      'onBefore',
      'onStart',
      'onProgress',
      'onFinish',
      'onCancel',
      'onSuccess',
      'onError',
    ],
  )
  createEffect(() => {
    if (mapped.as === 'a' && mapped.method !== 'get') {
      console.warn(
        `Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element using the "as" attribute. For example:\n\n<Link href="${href}" method="${method}" as="button">...</Link>`,
      )
    }
  })

  const visit = (event) => {
    mapped.onClick && mapped.onClick(event)

    if (shouldIntercept(event)) {
      event.preventDefault()
      router.visit(mapped.href, routerProps)
    }
  }

  return createComponent(
    Dynamic,
    mergeProps(
      {
        get component() {
          return mapped.as
        },
        onClick: visit,
      },
      rest,
      () => (mapped.as === 'a' ? { href: mapped.href } : {}),
    ),
  )
}
