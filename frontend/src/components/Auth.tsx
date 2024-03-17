import { useEffect, useState } from 'react'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import axios from 'axios'
import { useUser } from '../context'
import { useForm } from '../context/Form'

export default function Auth() {
  const [form, setForm] = useForm()
  const [user, setUser] = useUser()

  const [loading, setLoading] = useState(false)
  const initFormstate = { email: '', password: '' }
  const [formstate, setFormstate] = useState(initFormstate)

  const url = import.meta.env.VITE_URL

  useEffect(() => {
    setFormstate(initFormstate)
  }, [form])

  const handleAuth = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const { data } = await axios.post(`${url}/user/${form}`, formstate)

      if (!data.success) return alert(data.message)
      if (form === 'register') confirm('Successfully created an account.')

      setForm('')
      setUser({ ...user, isLogin: true, ...data.data })
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed flex items-center justify-center inset-0 z-50 bg-white/20'>
      <div className='relative w-[22rem] bg-white rounded h-[25.7rem] p-4'>
        <button
          onClick={() => setForm('')}
          className='absolute top-0 right-0 text-gray-400 border-gray-400 hover:border-gray-500 hover:text-gray-500 rounded-bl px-4 py-2 border-b-[1.5px] border-l-[1.5px] '
        >
          &#10006;
        </button>
        <h3 className='capitalize font-bold text-2xl text-gray-800 text-center mb-6'>{form}</h3>
        <form onSubmit={handleAuth} className='flex items-center flex-col gap-4 text-gray-600'>
          <input
            type='email'
            value={formstate.email}
            onChange={(e) => setFormstate({ ...formstate, email: e.target.value })}
            autoFocus
            minLength={8}
            placeholder='Email'
            className='bg-transparent focus:shadow-sm w-full tracking-wide rounded border-[1.5px] p-2 border-gray-300'
          />
          <input
            type='password'
            minLength={8}
            value={formstate.password}
            onChange={(e) => setFormstate({ ...formstate, password: e.target.value })}
            placeholder='Password'
            className='bg-transparent focus:shadow-sm w-full tracking-wide rounded border-[1.5px] p-2 border-gray-300'
          />
          <button
            type={!loading ? 'submit' : 'button'}
            className='capitalize hover:shadow-md shadow-blue-500 py-2 text-white font-semibold rounded bg-blue-500 w-full'
          >
            {!loading ? form : 'loading'}
          </button>
        </form>

        <div className='text-sm text-gray-700 text-center mt-2'>
          {form === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setForm(form === 'login' ? 'register' : 'login')}
            className='text-blue-500 font-semibold pl-1'
          >
            {form === 'login' ? 'Regsiter' : 'Login'}
          </button>
        </div>

        <div className='relative my-5'>
          <div className='absolute -top-5 bg-white text-gray-400 p-2 rounded-full right-1/2 translate-x-1/2'>
            or
          </div>
          <div className='h-[1px] bg-gray-300 w-full' />
        </div>

        <div className='text-gray-600 space-y-2 font-semibold'>
          <button className='cursor-not-allowed flex items-center w-full border-[1.5px] hover:shadow border-gray-300 py-2 px-4 rounded'>
            <FaGoogle className='h-6 w-6' />
            <div className='flex-1 text-center'>Continue with Google</div>
          </button>
          <button className='cursor-not-allowed bg-[#316FF6] flex items-center w-full hover:shadow-md shadow-blue-500 border-[1.5px] border-gray-300 py-2 px-4 rounded'>
            <FaFacebook className='h-6 w-6 text-white' />
            <div className='flex-1 text-center text-gray-300'>Continue with Facebook</div>
          </button>
        </div>
      </div>
    </div>
  )
}
