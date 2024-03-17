import { useState, createContext, useContext } from 'react'

const Context = createContext('')

export default function FormProvider({ children }) {
  const [form, setForm] = useState('')
  return <Context.Provider value={[form, setForm]}>{children}</Context.Provider>
}

export const useForm = () => useContext(Context)
