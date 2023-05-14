import { Link } from '@inertiajs/solid'
import { Title } from '@solidjs/meta'
import Layout from '~/Components/Layout'

const Home = () => {
  return (
    <>
      <Title>Home</Title>
      <h1 class="text-3xl">Home</h1>
      <p class="mt-6">
        <Link href="/article#far-down" class="text-blue-700 underline">
          Link to bottom of article page
        </Link>
      </p>
    </>
  )
}

Home.layout = (page) => <Layout children={page} />

export default Home
