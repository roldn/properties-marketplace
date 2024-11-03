import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import About from './pages/About'
import LogIn from './pages/Login'
import LogOut from './pages/Logout'

function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<LogIn/>}/>
      <Route path='/logout' element={<LogOut/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/about' element={<About/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
