import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import './app.css'
import 'react-tooltip/dist/react-tooltip.css'

import Drawer from "./components/Drawer.jsx";

function App() {
    return (
        <>
            <Router>
                <div className='container containerCustom'>
                    <Header/>
                    <Drawer/>
                </div>
            </Router>
            <ToastContainer/>
        </>
    )
}

export default App
