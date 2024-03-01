import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes.tsx'
import './index.css'

import { ThemeProvider } from '@material-tailwind/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  </BrowserRouter>
)
