import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from '@/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
