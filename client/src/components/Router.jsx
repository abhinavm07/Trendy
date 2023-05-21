import {Route, Routes} from "react-router-dom";
import LoginRegister from "../pages/LoginRegister.jsx";
import DashBoard from "../pages/Dashboard.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import TrackUser from "../pages/TrackUser.jsx";
import Home from "../pages/Home.jsx";
import ComparingUsers from "../pages/ComparingUsers.jsx";
import UserAnalytics from "../pages/UserAnalytics.jsx";
import Favourites from "../pages/Favourites.jsx";
import Watchlist from "../pages/Watchlist.jsx";
import Settings from "../pages/Setting.jsx";
import {useSelector} from "react-redux";

export default function Router() {
    const {user} = useSelector((state) => state.auth)
    let isAdmin = false;
    if (user) {
        isAdmin = user.isAdmin;
    }
    return (<Routes>
        <Route path='/login' element={<LoginRegister/>}/>
        <Route path='' element={<DashBoard/>}/>
        <Route path='/' element={<LoginRegister/>}/>
        <Route path='/dashboard' element={<PrivateRoute/>}>
            <Route path='/dashboard' element={<DashBoard/>}/>
        </Route>
        <Route path='/trackuser' element={<TrackUser/>}/>
        <Route path='/sentiment' element={<Home/>}/>
        <Route path='/favourites' element={<Favourites/>}/>
        <Route path='/watchlist' element={<Watchlist/>}/>

        <Route path='/register' element={<LoginRegister/>}/>
        <Route path='/forgot' element={<LoginRegister/>}/>
        <Route path='/comparison' element={<ComparingUsers/>}/>
        <Route path='/analytics' element={<UserAnalytics/>}/>
        {isAdmin && <Route path='/setting' element={<Settings/>}/>}
    </Routes>);
}