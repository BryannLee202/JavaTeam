import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const devMockMode = import.meta.env.DEV ? new URLSearchParams(location.search).get('mock') : null
if (devMockMode === 'judge') {
  const { installJudgeMock } = await import('./devMock')
  installJudgeMock()
} else if (devMockMode === 'coordinator') {
  const { installCoordinatorMock } = await import('./devMock')
  installCoordinatorMock()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
