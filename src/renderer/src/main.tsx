import './assets/main.css'

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Toaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster position='top-right' duration={5000} />
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </>

)
