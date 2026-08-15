import { BrowserRouter, Routes, Route } from 'react-router'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ChatAppPage from './pages/ChatAppPage'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
    <Toaster richColors />
      <BrowserRouter>
        <Routes>
          // public routes
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

          // protected routes
          <Route path="/chat" element={<ChatAppPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
