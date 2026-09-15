import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Font cai kem trong node_modules, khong tai tu Google Fonts nua.
// Ban variable: mot file cho moi day can nang thay vi mot file moi day nang.
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/lexend'

import './index.css'
import App from './App.tsx'

const devMockMode = import.meta.env.DEV ? new URLSearchParams(location.search).get('mock') : null
if (devMockMode === 'judge') {
  const { installJudgeMock } = await import('./devMock')
  installJudgeMock()
} else if (devMockMode === 'coordinator') {
  const { installCoordinatorMock } = await import('./devMock')
  installCoordinatorMock()
} else if (devMockMode === 'auth') {
  const { installAuthMock } = await import('./devMock')
  installAuthMock()
} else if (devMockMode === 'public' || devMockMode === 'voting' || devMockMode === 'ranking') {
  const { installPublicMock } = await import('./devMock')
  installPublicMock()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
