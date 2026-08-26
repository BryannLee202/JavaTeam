import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (import.meta.env.DEV && new URLSearchParams(location.search).get('mock') === 'judge') {
  const { installJudgeMock } = await import('./devMock')
  installJudgeMock()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
