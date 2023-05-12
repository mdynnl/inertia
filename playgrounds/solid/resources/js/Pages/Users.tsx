import { Head } from '@inertiajs/solid'
import Layout from '../Components/Layout'

const Users = ({ users }) => {
  return (
    <>
      <Head title="Users" />
      <h1 class="text-3xl">Users</h1>
      <div class="mt-6 w-full max-w-2xl overflow-hidden rounded border shadow-sm">
        <table class="w-full text-left">
          <thead>
            <tr>
              <th class="px-4 py-2">Id</th>
              <th class="px-4 py-2">Name</th>
              <th class="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr class="border-t">
                <td class="px-4 py-2">{user.id}</td>
                <td class="px-4 py-2">{user.name}</td>
                <td class="px-4 py-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

Users.layout = (page) => <Layout children={page} />

export default Users
