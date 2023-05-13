import { Title } from 'solid-meta'
import Layout from '../Components/Layout'

const User = (props) => {
  return (
    <>
      <Title title="User" />
      <h1 class="text-3xl">User</h1>
      <p class="mt-6">You successfully created a new user! Well not really, there is no persistence in this app.</p>
      <ul class="mt-6 space-y-2">
        <li>
          <strong>Name:</strong> {props.user.name}
        </li>
        <li>
          <strong>Company:</strong> {props.user.company}
        </li>
        <li>
          <strong>Role:</strong> {props.user.role}
        </li>
      </ul>
    </>
  )
}

User.layout = (page) => <Layout children={page} />

export default User
