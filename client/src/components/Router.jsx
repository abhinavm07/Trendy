import {Route, Routes} from "react-router-dom";
import LoginRegister from "../pages/LoginRegister.jsx";
import DashBoard from "../pages/Dashboard.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import TrackUser from "../pages/TrackUser.jsx";
import Home from "../pages/Home.jsx";
import ComparingUsers from "../pages/ComparingUsers.jsx";
import UserAnalytics from "../pages/UserAnalytics.jsx";
import UnderConstruction from "./UnderConstruction.jsx";

export default function Router() {
    return (<Routes>
        <Route path='/login' element={<LoginRegister/>}/>
        <Route path='' element={<DashBoard/>}/>
        <Route path='/' element={<LoginRegister/>}/>
        <Route path='/dashboard' element={<PrivateRoute/>}>
            <Route path='/dashboard' element={<DashBoard/>}/>
        </Route>
        <Route path='/trackuser' element={<TrackUser/>}/>
        <Route path='/sentiment' element={<Home/>}/>

        <Route path='/register' element={<LoginRegister/>}/>
        <Route path='/comparison' element={<ComparingUsers/>}/>
        <Route path='/analytics' element={<UserAnalytics/>}/>
        <Route path='/support' element={<UnderConstruction/>}/>
        <Route path='/setting' element={<UnderConstruction/>}/>
    </Routes>);
}