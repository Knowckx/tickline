import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NavigatorApp } from '@/components/navigator'
import '@/main.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <NavigatorApp />
    </StrictMode>,
)
