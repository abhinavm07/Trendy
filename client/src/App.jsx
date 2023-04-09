import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/components/Login.jsx'
import Home from './pages/Home'
import Register from './pages/components/Register.jsx'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import './app.css'
import TrackUser from './pages/TrackUser'
import DashBoard from './pages/DashBoard'
import UnderConstruction from './components/UnderConstruction'
import ComparingUsers from './pages/ComparingUsers'
import User from './pages/User'
import LoginRegister from "./pages/LoginRegister.jsx";

function App() {
    return (
        <>
            <Router>
                <div className='container'>
                    <Header/>
                    <Routes>
                        <Route path='/login' element={<LoginRegister/>}/>
                        <Route path='/dashboard' element={<PrivateRoute/>}>
                            <Route path='/dashboard' element={<DashBoard/>}/>
                        </Route>
                        <Route path='/trackuser' element={<TrackUser/>}/>
                        <Route path='/sentiment' element={<Home/>}/>

                        <Route path='/register' element={<LoginRegister/>}/>
                        <Route path='/comparision' element={<ComparingUsers/>}/>
                        <Route path='/analytics' element={<User/>}/>
                        <Route path='/support' element={<UnderConstruction/>}/>
                        <Route path='/setting' element={<UnderConstruction/>}/>
                    </Routes>
                </div>
            </Router>
            <ToastContainer/>
        </>
    )
}

export default App
