import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes.tsx'
import './index.css'
import axios from 'axios'

import UserProvider from './context/User'
import FormProvider from './context/Form'
import { ThemeProvider } from '@material-tailwind/react'

axios.defaults.validateStatus = () => true
axios.defaults.withCredentials = true

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <FormProvider>
        <UserProvider>
          <Routes />
        </UserProvider>
      </FormProvider>
    </ThemeProvider>
  </BrowserRouter>
)
