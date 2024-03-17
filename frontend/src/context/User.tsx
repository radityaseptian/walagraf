import { useState, createContext, useContext } from 'react'

interface User {
  isLogin: boolean
  email: string
  instances: { id: string; name: string; type: 'telegram' | 'whatsapp' }[]
}

type UserContextType = [User | null, React.Dispatch<React.SetStateAction<User | null>>, User]

const initUser = { isLogin: false, email: '', instances: [] }

const Context = createContext<UserContextType>([null, () => null, initUser])

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const initial: User = initUser
  const [user, setUser] = useState<User | null>(initial)

  return <Context.Provider value={[user, setUser, initUser]}>{children}</Context.Provider>
}

export const useUser = (): UserContextType => useContext(Context)
