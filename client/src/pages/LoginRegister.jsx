import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

export default function LoginRegister () {

    function isLoginRoute() {
        return window.location.pathname === '/login';
    }

return (
    <>
        <div className="backdoor-container rounded">
            <div className="image-left">
            </div>
            <div className="form-right">
                {
                    isLoginRoute() ? <Login /> : <Register />
                }
            </div>
        </div>
    </>
);
}