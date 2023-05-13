import { Title } from 'solid-meta'
import Layout from '../Components/Layout'

const Login = () => {
  return (
    <>
      <Title title="Login" />
      <h1 class="text-3xl">Login</h1>
      <p class="mt-6">
        You made a <code>POST</code> request to the logout endpoint and were redirected to the login page.
      </p>
    </>
  )
}

Login.layout = (page) => <Layout children={page} />

export default Login
