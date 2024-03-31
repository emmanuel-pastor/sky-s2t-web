import ReactDOM from 'react-dom/client'
import App from '@/screens/App.tsx'
import './index.css'
import {GoogleOAuthProvider} from "@react-oauth/google";
import './i18n.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App/>
  </GoogleOAuthProvider>
)
