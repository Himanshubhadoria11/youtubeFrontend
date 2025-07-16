import { useState, createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signin, signout } from "./redux/authSlice"; // Import Redux actions
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import Loader from "./components/Loader.jsx";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

export const newContext = createContext(); // Create a new context

function App() {
    const [isCollapse, setIsCollapse] = useState(true); // State for sidebar collapse
    const dispatch = useDispatch();
    const isSigned = useSelector((state) => state.auth.isAuthenticated); // Get authentication state
    const token = useSelector((state) => state.auth.user?.token); // Get user token
    const [loading, setLoading] = useState(true); // State for loading

    useEffect(() => {
        if (token) {
            dispatch(signin({ token })); // Sign in if token exists
        }
        setLoading(false); // Set loading to false
    }, [token, dispatch]);

    function handleCollapse() {
        setIsCollapse((prevState) => !prevState); // Toggle sidebar collapse state
    }

    function handleSignIn(token) {
        dispatch(signin({ token })); // Dispatch sign in action
    }

    function handleSignOut() {
        dispatch(signout()); // Dispatch sign out action
    }

    if (loading) {
        return <Loader/>; // Show loader while loading
    }

    return (
        <newContext.Provider className="whole" value={{ isCollapse, setIsCollapse, handleCollapse, isSigned, handleSignIn, handleSignOut }}>
            <Header />
            <div className="home">
                <Sidebar />
                <div className={`videos ${isCollapse ? "collapsed" : ""}`}>
                    <Outlet />
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </newContext.Provider>
    );
}

export default App;
