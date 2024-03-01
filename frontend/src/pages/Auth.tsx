import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'

const Auth = () => {
  const [input, setInput] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // useEffect(() => {
  //   axios
  //     .get(url + '/admin/status', { withCredentials: true, validateStatus: () => true })
  //     .then(({ data }) => {
  //       if (data.success) {
  //         setAdmin(data.data)
  //         return navigate('/dash/chat', { replace: true })
  //       }
  //     })
  //     .catch(() => {})
  // }, [])

  const url = import.meta.env.VITE_URL
  const namepath = pathname.slice(1, pathname.length)
  const isRouteLogin = namepath === 'auth/login'

  const authentication = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${url}/admin${isRouteLogin ? '/login' : '/register'}`,
        { username: input.email.trim(), password: input.password.trim() },
        { withCredentials: true }
      )
      if (!data.success) return alert(data.message)
      if (isRouteLogin) return navigate('/dashboard', { replace: true })
      const res = confirm(
        'Successfully created an account, navigate to the login page?'
      )
      if (res) navigate('/auth/login')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-full max-w-sm -translate-y-16'>
        <form
          onSubmit={authentication}
          className='bg-gray-800 shadow-md rounded p-6 uppercase'
        >
          <h2 className='text-xl tracking-wider pb-3 font-bold text-slate-100'>
            {namepath}
          </h2>
          <div className='mb-4'>
            <label
              className='block text-gray-200 text-sm font-semibold mb-2'
              htmlFor='email'
            >
              email
            </label>
            <input
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline'
              id='email'
              type='text'
              placeholder='Email'
            />
          </div>
          <div className='mb-5'>
            <label
              className='block text-gray-200 text-sm font-semibold mb-2'
              htmlFor='password'
            >
              password
            </label>
            <input
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
              className='shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              placeholder='* * * * * *'
            />
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <button
              disabled={
                loading || !input.email.trim() || !input.password.trim()
              }
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded capitalize'
              type='submit'
            >
              {namepath.split('/')[1]}
            </button>
            <Link
              to={isRouteLogin ? '/auth/register' : '/auth/login'}
              className='normal-case text-slate-200 underline'
            >
              {isRouteLogin ? 'Register new account' : 'Login to account'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth
