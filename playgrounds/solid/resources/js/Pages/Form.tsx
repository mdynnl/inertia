import { useForm } from '@inertiajs/solid'
import { Title } from 'solid-meta'
import Layout from '../Components/Layout'

const Form = () => {
  const form = useForm('NewUser', {
    name: '',
    company: '',
    role: '',
  })

  function submit(e) {
    e.preventDefault()
    form.post('/user')
  }

  return (
    <>
      <Title title="Form" />
      <h1 class="text-3xl">Form</h1>
      <form onSubmit={submit} class="mt-6 max-w-md space-y-4">
        {form.isDirty && (
          <div class="my-5 rounded border border-amber-100 bg-amber-50 p-3 text-amber-800">
            There are unsaved changes!
          </div>
        )}
        <div>
          <label class="block" for="name">
            Name:
          </label>
          <input
            type="text"
            value={form.data.name}
            onInput={(e) => form.setData('name', e.target.value)}
            id="name"
            class="mt-1 w-full appearance-none rounded border px-2 py-1 shadow-sm"
          />
          {form.errors.name && <div class="mt-2 text-sm text-red-600">{form.errors.name}</div>}
        </div>
        <div>
          <label class="block" for="company">
            Company:
          </label>
          <input
            type="text"
            value={form.data.company}
            onInput={(e) => form.setData('company', e.target.value)}
            id="company"
            class="mt-1 w-full appearance-none rounded border px-2 py-1 shadow-sm"
          />
          {form.errors.company && <div class="mt-2 text-sm text-red-600">{form.errors.company}</div>}
        </div>
        <div>
          <label class="block" for="role">
            Role:
          </label>
          <select
            value={form.data.role}
            onInput={(e) => form.setData('role', e.target.value)}
            id="role"
            class="mt-1 w-full appearance-none rounded border px-2 py-1 shadow-sm"
          >
            <option></option>
            <option>User</option>
            <option>Admin</option>
            <option>Super</option>
          </select>
          {form.errors.role && <div class="mt-2 text-sm text-red-600">{form.errors.role}</div>}
        </div>
        <div class="flex gap-4">
          <button type="submit" disabled={form.processing} class="rounded bg-slate-800 px-6 py-2 text-white">
            Submit
          </button>
          <button type="button" onClick={() => form.reset()}>
            Reset
          </button>
        </div>
      </form>
    </>
  )
}

Form.layout = (page) => <Layout children={page} />

export default Form
