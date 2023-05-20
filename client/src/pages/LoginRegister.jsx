import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";

export default function LoginRegister () {

    function isLoginRoute() {
        return window.location.pathname === '/login';
    }

    function isForgotPasswordRoute() {
        return window.location.pathname === '/forgot';
    }

return (
    <>
        <div className="backdoor-container rounded">
            <div className="image-left">
            </div>
            <div className="form-right">
                {
                    isForgotPasswordRoute() ? <ForgotPassword /> : isLoginRoute() ? <Login /> : <Register />
                }
            </div>
        </div>
    </>
);
}