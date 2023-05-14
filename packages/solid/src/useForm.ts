import { Method, Progress, router, VisitOptions } from '@inertiajs/core'
import isEqual from 'lodash.isequal'
import { batch, createSignal, mergeProps } from 'solid-js'
import { useRemember } from './useRemember'

type setDataByObject<TForm> = (data: TForm) => void
type setDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(key: K, value: TForm[K]) => void

export interface InertiaFormProps<TForm extends Record<string, unknown>> {
  data: TForm
  isDirty: boolean
  errors: Partial<Record<keyof TForm, string>>
  hasErrors: boolean
  processing: boolean
  progress: Progress | null
  wasSuccessful: boolean
  recentlySuccessful: boolean
  setData: setDataByObject<TForm> & setDataByMethod<TForm> & setDataByKeyValuePair<TForm>
  transform: (callback: (data: TForm) => TForm) => void
  setDefaults(): void
  setDefaults(field: keyof TForm, value: string): void
  setDefaults(fields: Record<keyof TForm, string>): void
  reset: (...fields: (keyof TForm)[]) => void
  clearErrors: (...fields: (keyof TForm)[]) => void
  setError(field: keyof TForm, value: string): void
  setError(errors: Record<keyof TForm, string>): void
  submit: (method: Method, url: string, options?: VisitOptions) => void
  get: (url: string, options?: VisitOptions) => void
  patch: (url: string, options?: VisitOptions) => void
  post: (url: string, options?: VisitOptions) => void
  put: (url: string, options?: VisitOptions) => void
  delete: (url: string, options?: VisitOptions) => void
  cancel: () => void
}
export function useForm<TForm extends Record<string, unknown>>(initialValues?: TForm): InertiaFormProps<TForm>
export function useForm<TForm extends Record<string, unknown>>(
  rememberKey: string,
  initialValues?: TForm,
): InertiaFormProps<TForm>
export function useForm<TForm extends Record<string, unknown>>(
  rememberKeyOrInitialValues?: string | TForm,
  maybeInitialValues?: TForm,
): InertiaFormProps<TForm> {
  const rememberKey = typeof rememberKeyOrInitialValues === 'string' ? rememberKeyOrInitialValues : null
  const [defaults, setDefaults] = createSignal(
    (typeof rememberKeyOrInitialValues === 'string' ? maybeInitialValues : rememberKeyOrInitialValues) || ({} as TForm),
  )
  let cancelToken
  let recentlySuccessfulTimeoutId
  const [data, setData] = rememberKey ? useRemember(defaults(), `${rememberKey}:data`) : createSignal(defaults())
  const [errors, setErrors] = rememberKey
    ? useRemember({} as Partial<Record<keyof TForm, string>>, `${rememberKey}:errors`)
    : createSignal({} as Partial<Record<keyof TForm, string>>)
  const [hasErrors, setHasErrors] = createSignal(false)
  const [processing, setProcessing] = createSignal(false)
  const [progress, setProgress] = createSignal(null)
  const [wasSuccessful, setWasSuccessful] = createSignal(false)
  const [recentlySuccessful, setRecentlySuccessful] = createSignal(false)
  let transform = (data) => data

  const submit = (method, url, options: VisitOptions = {}) => {
    const _options = {
      ...options,
      onCancelToken: (token) => {
        cancelToken = token

        options.onCancelToken?.(token)
      },
      onBefore: (visit) => {
        batch(() => {
          setWasSuccessful(false)
          setRecentlySuccessful(false)
        })
        clearTimeout(recentlySuccessfulTimeoutId)

        options.onBefore?.(visit)
      },
      onStart: (visit) => {
        setProcessing(true)

        options.onStart?.(visit)
      },
      onProgress: (event) => {
        setProgress(event)

        options.onProgress?.(event)
      },
      onSuccess: (page) => {
        batch(() => {
          setProcessing(false)
          setProgress(null)
          setErrors({})
          setHasErrors(false)
          setWasSuccessful(true)
          setRecentlySuccessful(true)
        })
        recentlySuccessfulTimeoutId = setTimeout(() => {
          setRecentlySuccessful(false)
        }, 2000)

        options.onSuccess?.(page)
      },
      onError: (errors) => {
        batch(() => {
          setProcessing(false)
          setProgress(null)
          setErrors(errors)
          setHasErrors(true)
        })

        options.onError?.(errors)
      },
      onCancel: () => {
        batch(() => {
          setProcessing(false)
          setProgress(null)
        })

        options.onCancel?.()
      },
      onFinish: () => {
        batch(() => {
          setProcessing(false)
          setProgress(null)
        })

        cancelToken = null

        options.onFinish?.(null)
      },
    }

    if (method === 'delete') {
      router.delete(url, { ..._options, data: transform(data()) })
    } else {
      router[method](url, transform(data()), _options)
    }
  }

  return mergeProps({
    data: mergeProps(data) as TForm,
    setData(keyOrData: keyof TForm | Function | TForm, maybeValue?: TForm[keyof TForm]) {
      if (typeof keyOrData === 'string') {
        setData((data) => ({ ...data, [keyOrData]: maybeValue }))
      } else if (typeof keyOrData === 'function') {
        setData((data) => keyOrData(data))
      } else {
        setData(() => keyOrData as TForm)
      }
    },
    get isDirty() {
      return !isEqual(data(), defaults())
    },
    errors: mergeProps(errors),
    get hasErrors() {
      return hasErrors()
    },
    get processing() {
      return processing()
    },
    get progress() {
      return progress()
    },
    get wasSuccessful() {
      return wasSuccessful()
    },
    get recentlySuccessful() {
      return recentlySuccessful()
    },
    transform(callback) {
      transform = callback
    },
    setDefaults(fieldOrFields?: keyof TForm | Record<keyof TForm, string>, maybeValue?: string) {
      if (typeof fieldOrFields === 'undefined') {
        setDefaults(data)
      } else {
        setDefaults((defaults) => ({
          ...defaults,
          ...(typeof fieldOrFields === 'string' ? { [fieldOrFields]: maybeValue } : (fieldOrFields as TForm)),
        }))
      }
    },
    reset(...fields) {
      if (fields.length === 0) {
        setData(defaults)
      } else {
        setData((data) =>
          (Object.keys(defaults) as Array<keyof TForm>)
            .filter((key) => fields.includes(key))
            .reduce(
              (carry, key) => {
                carry[key] = defaults()[key]
                return carry
              },
              { ...data },
            ),
        )
      }
    },
    setError(fieldOrFields: keyof TForm | Record<keyof TForm, string>, maybeValue?: string) {
      setErrors((errors) => {
        const newErrors = {
          ...errors,
          ...(typeof fieldOrFields === 'string'
            ? { [fieldOrFields]: maybeValue }
            : (fieldOrFields as Record<keyof TForm, string>)),
        }
        setHasErrors(Object.keys(newErrors).length > 0)
        return newErrors
      })
    },
    clearErrors(...fields) {
      setErrors((errors) => {
        const newErrors = (Object.keys(errors) as Array<keyof TForm>).reduce(
          (carry, field) => ({
            ...carry,
            ...(fields.length > 0 && !fields.includes(field) ? { [field]: errors[field] } : {}),
          }),
          {},
        )
        setHasErrors(Object.keys(newErrors).length > 0)
        return newErrors
      })
    },
    submit,
    get(url, options) {
      submit('get', url, options)
    },
    post(url, options) {
      submit('post', url, options)
    },
    put(url, options) {
      submit('put', url, options)
    },
    patch(url, options) {
      submit('patch', url, options)
    },
    delete(url, options) {
      submit('delete', url, options)
    },
    cancel() {
      cancelToken?.cancel?.()
    },
  }, data)
}
