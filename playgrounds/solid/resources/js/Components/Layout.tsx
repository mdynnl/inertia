import { Link, usePage } from '@inertiajs/solid'
import { ParentProps } from 'solid-js'

export default function Layout(props: ParentProps) {
  const page = usePage<{ appName: string }>()

  return (
    <>
      <nav class="flex items-center space-x-6 bg-slate-800 px-10 py-6 text-white">
        <div class="rounded-lg bg-slate-700 px-4 py-1">{page.props.appName}</div>
        <Link href="/" class="hover:underline">
          Home
        </Link>
        <Link href="/users" class="hover:underline">
          Users
        </Link>
        <Link href="/article" class="hover:underline">
          Article
        </Link>
        <Link href="/form" class="hover:underline">
          Form
        </Link>
        <Link href="/logout" method="post" as="button" type="button" class="hover:underline">
          Logout
        </Link>
      </nav>
      <main class="px-10 py-8">{props.children}</main>
    </>
  )
}
