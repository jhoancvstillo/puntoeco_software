import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from  './pages/LoginPage'
import WelcomePage from './pages/WelcomePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
      </Routes>
    </Router>
  )
}

export default App