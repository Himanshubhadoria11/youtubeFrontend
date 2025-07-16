import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/header.css";
import { FaMicrophone, FaYoutube, FaGoogle, FaKeyboard } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { BsList } from "react-icons/bs";
import { newContext } from "../App";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { PiUserCircleThin } from "react-icons/pi";
import { CiStreamOn, CiSettings, CiLocationOn } from "react-icons/ci";
import { BiEdit, BiSolidPurchaseTag } from "react-icons/bi";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { SiYoutubestudio } from "react-icons/si";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdOutlineFeedback, MdSwitchAccount, MdSecurity } from "react-icons/md";
import { IoLanguageOutline, IoArrowBack } from "react-icons/io5";

function Header() {
    const { handleCollapse } = useContext(newContext);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [isCreateClicked, setIsCreateClicked] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isSigned = useSelector((state) => state.auth.isAuthenticated);
    const userId = useSelector((state) => state.auth.user?._id);

    const profileRef = useRef(null);
    const createRef = useRef(null);

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        axios.get(userId ? `${API_URL}/api/users/${userId}` : null)
            .then((response) => {
                setUser(response.data.user);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [userId, API_URL]);

    function handleIsClicked(menuType) {
        if (menuType === "create") {
            setIsCreateClicked((prev) => !prev);
            setIsProfileClicked(false);
        } else if (menuType === "profile") {
            setIsProfileClicked((prev) => !prev);
            setIsCreateClicked(false);
        }
    }

    function handleUpload() {
        user.channel ? navigate('/uploadVideo') : toast.error("Please Create channel to upload Video")
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (isProfileClicked && profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileClicked(false);
            }
            if (isCreateClicked && createRef.current && !createRef.current.contains(event.target)) {
                setIsCreateClicked(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isProfileClicked, isCreateClicked]);

    const handleSearchSubmit = () => {
        if (search.length <= 0) {
            return toast.error("Enter something to search");
        }
        navigate(`/search/${search}`);
        setSearch("");
    };

    const handleSearchClick = () => setShowSearch(true);
    const handleBackClick = () => setShowSearch(false);

    return (
        <div className="header">
            <div className="logo-Container">
                <button className="menu" onClick={handleCollapse}><BsList /></button>
                <Link to={'/'}><div className="logo">  <FaYoutube /> <p>YouTube</p> </div></Link>
            </div>
            <div className="searchContainer">
                <div className="search-field">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search" id="search-bar" />
                    <button type="submit" onClick={handleSearchSubmit} className="search-button">
                        <GoSearch size={20} />
                    </button>
                </div>
                <button className="microphone"><FaMicrophone /></button>
            </div>
            <div className="mbl-header">
                {!showSearch && (
                    <div className="mbl-header-content">
                        <div className="mbl-logo-Container">
                            <button className="menu" onClick={handleCollapse}><BsList /></button>
                            <Link to={'/'}><div className="logo">  <FaYoutube /> <p>YouTube</p> </div></Link>
                        </div>
                    </div>
                )}
                <div className={`mbl-search-container ${showSearch ? "active" : ""}`}>
                    {showSearch && (
                        <button className="mbl-back-btn" onClick={handleBackClick}>
                            <IoArrowBack size={24} />
                        </button>
                    )}
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search"
                        className="mbl-search-bar"
                        autoFocus={showSearch}
                    />
                    {showSearch && (
                        <button type="submit" onClick={handleSearchSubmit} className="mbl-search-btn">
                            <GoSearch size={20} />
                        </button>
                    )}

                    {!showSearch && (
                        <button id="mbl-search-btn" onClick={handleSearchClick}>
                            <GoSearch size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="action-container">
                {isSigned ? (
                    <div className="user-actions">
                        <div ref={createRef}>
                            <button id="create" onClick={() => handleIsClicked("create")}>
                                <FiPlus /> <span> Create </span>
                            </button>
                            {isCreateClicked && (
                                <div className="dropdown-menu2">
                                    <button className="dropdown-item" onClick={() => handleUpload()}>
                                        <AiOutlinePlaySquare /> <span>Upload video</span>
                                    </button>
                                    <button className="dropdown-item">
                                        <CiStreamOn /><span>Go live</span>
                                    </button>
                                    <button className="dropdown-item">
                                        <BiEdit /><span>Create post</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div ref={profileRef}>
                            <button className="profile" onClick={() => handleIsClicked("profile")}>
                                {user?.avatar ? (
                                    <img src={user?.avatar} alt="Profile" className="profile-pic" />
                                ) : (
                                    <div className="profile-placeholder">
                                        {`${user?.userName?.charAt(0).toUpperCase()}`}
                                    </div>
                                )}
                            </button>

                            {isProfileClicked && (
                                <div className="dropdown-menu">
                                    <div className="userProfile">
                                        {user?.avatar ? (
                                            <img src={user?.avatar} alt="Profile" className="profile-pic" />
                                        ) : (
                                            <div className="profile-placeholder">
                                                {`${user?.userName?.charAt(0).toUpperCase()}`}
                                            </div>
                                        )}
                                        <div className="dropdown-div">
                                            <p id="userName"> <Link to={`/profile/${user?._id}`}> {user?.userName} </Link></p>
                                            {user && user.channel?.length > 0 ? (
                                                <Link to={`/channel/${user?.channel}`}>View your channel</Link>
                                            ) : (
                                                <Link to={`/channel`}>Create your channel</Link>
                                            )}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="dropdown-div">
                                        <p> <FaGoogle /> <span> Google Account </span> </p>
                                        <p> <MdSwitchAccount /> <span> Switch Account </span> </p>
                                        <Link to={'/'}>
                                            <button className="dropdown-item" onClick={() => dispatch(signout())}>
                                                <RiLogoutBoxRLine /><span> Logout</span>
                                            </button>
                                        </Link>
                                    </div>
                                    <hr />
                                    <div className="dropdown-div">
                                        <p> <SiYoutubestudio /> <span> YouTube Studio </span> </p>
                                        <p> <BiSolidPurchaseTag /><span> Purchases and memberships </span> </p>
                                    </div>
                                    <hr />
                                    <div className="dropdown-div">
                                        <p> <MdSecurity /> <span> Your data in YouTube </span> </p>
                                        <p> <IoLanguageOutline /> <span> Language: English </span> </p>
                                        <p> <CiLocationOn /> <span> Location: India </span> </p>
                                        <p> <FaKeyboard /> <span> Keyboard shortcuts </span> </p>
                                    </div>
                                    <hr />
                                    <div className="dropdown-div">
                                        <p><CiSettings /> <span> Settings </span> </p>
                                    </div>
                                    <hr />
                                    <div className="dropdown-div">
                                        <p><IoIosHelpCircleOutline /> <span> Help </span> </p>
                                        <p><MdOutlineFeedback /> <span> Send feedback </span> </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Link to={'/login'}>
                        <button id="create"><PiUserCircleThin /> <span> Sign in </span> </button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Header;

// import { useContext, useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { signout } from "../redux/authSlice";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FaMicrophone, FaYoutube, FaGoogle, FaKeyboard } from "react-icons/fa";
// import { GoSearch } from "react-icons/go";
// import { BsList } from "react-icons/bs";
// import { newContext } from "../App";
// import { FiPlus } from "react-icons/fi";
// import { PiUserCircleThin } from "react-icons/pi";
// import { CiStreamOn, CiSettings, CiLocationOn } from "react-icons/ci";
// import { BiEdit, BiSolidPurchaseTag } from "react-icons/bi";
// import { AiOutlinePlaySquare } from "react-icons/ai";
// import { RiLogoutBoxRLine } from "react-icons/ri";
// import { SiYoutubestudio } from "react-icons/si";
// import { IoIosHelpCircleOutline } from "react-icons/io";
// import { MdOutlineFeedback, MdSwitchAccount, MdSecurity } from "react-icons/md";
// import { IoLanguageOutline, IoArrowBack } from "react-icons/io5";

// function Header() {
//     const { handleCollapse } = useContext(newContext);
//     const [search, setSearch] = useState("");
//     const [showSearch, setShowSearch] = useState(false);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [isProfileClicked, setIsProfileClicked] = useState(false);
//     const [isCreateClicked, setIsCreateClicked] = useState(false);

//     const API_URL = import.meta.env.VITE_API_URL;

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const isSigned = useSelector((state) => state.auth.isAuthenticated);
//     const userId = useSelector((state) => state.auth.user?._id);

//     const profileRef = useRef(null);
//     const createRef = useRef(null);

//     useEffect(() => {
//         if (!userId) return;

//         setLoading(true);
//         axios.get(`${API_URL}/api/users/${userId}`)
//             .then((res) => {
//                 setUser(res.data.user);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 setError(err.message);
//                 setLoading(false);
//             });
//     }, [userId, API_URL]);

//     const handleIsClicked = (type) => {
//         setIsProfileClicked(type === "profile" ? !isProfileClicked : false);
//         setIsCreateClicked(type === "create" ? !isCreateClicked : false);
//     };

//     const handleUpload = () => {
//         user?.channel
//             ? navigate("/uploadVideo")
//             : toast.error("Please create a channel to upload video");
//     };

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (isProfileClicked && profileRef.current && !profileRef.current.contains(e.target)) {
//                 setIsProfileClicked(false);
//             }
//             if (isCreateClicked && createRef.current && !createRef.current.contains(e.target)) {
//                 setIsCreateClicked(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [isProfileClicked, isCreateClicked]);

//     const handleSearchSubmit = () => {
//         if (search.length <= 0) {
//             return toast.error("Enter something to search");
//         }
//         navigate(`/search/${search}`);
//         setSearch("");
//     };

//     const handleSearchClick = () => setShowSearch(true);
//     const handleBackClick = () => setShowSearch(false);

//     return (
//         <div className="sticky top-0 left-0 z-50 flex h-[60px] items-center justify-between px-4 bg-white shadow-[0_-4px_8px_0.0001px_black] w-full">
//             {/* Desktop Header */}
//             <div className="hidden sm:flex items-center gap-5 text-black">
//                 <button onClick={handleCollapse} className="text-xl h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200">
//                     <BsList />
//                 </button>
//                 <Link to="/" className="flex items-center gap-1 font-semibold">
//                     <FaYoutube className="text-red-600 text-2xl" />
//                     <p className="text-xl">YouTube</p>
//                 </Link>
//             </div>

//             <div className="hidden sm:flex flex-[0_1_50%] items-center justify-end gap-2">
//                 <div className="flex items-center h-10 border border-gray-300 rounded-full overflow-hidden max-w-[600px] w-full">
//                     <input
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder="Search"
//                         className="w-[90%] h-full px-2 border-none focus:outline-none"
//                     />
//                     <button onClick={handleSearchSubmit} className="w-[10%] h-full px-4">
//                         <GoSearch size={20} />
//                     </button>
//                 </div>
//                 <button className="h-10 w-10 rounded-full flex items-center justify-center border border-gray-300 text-lg">
//                     <FaMicrophone />
//                 </button>
//             </div>

//             {/* Mobile Header */}
//             <div className="flex sm:hidden items-center justify-between w-full relative">
//                 {!showSearch && (
//                     <div className="flex items-center gap-2">
//                         <button onClick={handleCollapse} className="text-xl">
//                             <BsList />
//                         </button>
//                         <Link to="/" className="flex items-center gap-1 font-semibold">
//                             <FaYoutube className="text-red-600 text-2xl" />
//                             <p className="text-lg">YouTube</p>
//                         </Link>
//                     </div>
//                 )}

//                 <div className={`flex items-center transition-all rounded-full bg-gray-300 px-3 ${showSearch ? "w-[70vw] ml-8" : ""}`}>
//                     {showSearch && (
//                         <button className="absolute left-2 top-1/2 transform -translate-y-1/2" onClick={handleBackClick}>
//                             <IoArrowBack size={20} />
//                         </button>
//                     )}
//                     <input
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder="Search"
//                         className={`bg-transparent py-2 px-2 w-full focus:outline-none ${showSearch ? "block" : "hidden"}`}
//                     />
//                     <button onClick={showSearch ? handleSearchSubmit : handleSearchClick}>
//                         <GoSearch size={20} />
//                     </button>
//                 </div>
//             </div>

//             {/* User Section */}
//             <div className="hidden sm:flex items-center gap-4">
//                 {isSigned ? (
//                     <div className="flex items-center gap-4">
//                         {/* Create Button */}
//                         <div ref={createRef} className="relative">
//                             <button
//                                 onClick={() => handleIsClicked("create")}
//                                 className="flex items-center gap-2 px-2 py-1 border border-gray-300 rounded-full text-blue-500 text-2xl font-light hover:bg-sky-200"
//                             >
//                                 <FiPlus />
//                                 <span className="text-sm font-bold">Create</span>
//                             </button>
//                             {isCreateClicked && (
//                                 <div className="absolute top-12 right-0 bg-white shadow-md rounded-lg w-52 p-2 z-50 flex flex-col gap-2">
//                                     <button onClick={handleUpload} className="flex items-center gap-2 text-lg hover:bg-gray-200 p-2 rounded">
//                                         <AiOutlinePlaySquare />
//                                         <span className="text-sm">Upload video</span>
//                                     </button>
//                                     <button className="flex items-center gap-2 text-lg hover:bg-gray-200 p-2 rounded">
//                                         <CiStreamOn />
//                                         <span className="text-sm">Go live</span>
//                                     </button>
//                                     <button className="flex items-center gap-2 text-lg hover:bg-gray-200 p-2 rounded">
//                                         <BiEdit />
//                                         <span className="text-sm">Create post</span>
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Profile Dropdown */}
//                         <div ref={profileRef} className="relative">
//                             <button onClick={() => handleIsClicked("profile")} className="h-10 w-10 rounded-full flex items-center justify-center border border-gray-300 overflow-hidden">
//                                 {user?.avatar ? (
//                                     <img src={user.avatar} alt="profile" className="h-full w-full object-cover rounded-full" />
//                                 ) : (
//                                     <div className="bg-red-700 text-white font-bold flex items-center justify-center w-full h-full text-lg">
//                                         {user?.userName?.charAt(0).toUpperCase()}
//                                     </div>
//                                 )}
//                             </button>
//                             {isProfileClicked && (
//                                 <div className="absolute top-12 right-0 w-72 bg-white shadow-lg rounded-lg z-50 p-3 flex flex-col gap-2">
//                                     <div className="flex items-center gap-3 p-2">
//                                         {user?.avatar ? (
//                                             <img src={user.avatar} alt="profile" className="h-10 w-10 rounded-full" />
//                                         ) : (
//                                             <div className="w-10 h-10 bg-red-700 text-white rounded-full flex items-center justify-center font-bold">
//                                                 {user?.userName?.charAt(0).toUpperCase()}
//                                             </div>
//                                         )}
//                                         <div className="flex flex-col">
//                                             <Link to={`/profile/${user?._id}`} className="font-medium">{user?.userName}</Link>
//                                             {user?.channel ? (
//                                                 <Link to={`/channel/${user.channel}`} className="text-sm text-blue-600">View your channel</Link>
//                                             ) : (
//                                                 <Link to={`/channel`} className="text-sm text-blue-600">Create your channel</Link>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <hr />
//                                     <div className="flex flex-col gap-2">
//                                         <p className="flex items-center gap-3 text-lg"><FaGoogle /> Google Account</p>
//                                         <p className="flex items-center gap-3 text-lg"><MdSwitchAccount /> Switch Account</p>
//                                         <button onClick={() => dispatch(signout())} className="flex items-center gap-3 text-lg hover:bg-gray-200 p-2 rounded">
//                                             <RiLogoutBoxRLine /> Logout
//                                         </button>
//                                     </div>
//                                     <hr />
//                                     <div className="flex flex-col gap-2">
//                                         <p className="flex items-center gap-3 text-lg"><SiYoutubestudio /> YouTube Studio</p>
//                                         <p className="flex items-center gap-3 text-lg"><BiSolidPurchaseTag /> Purchases & memberships</p>
//                                     </div>
//                                     <hr />
//                                     <div className="flex flex-col gap-2">
//                                         <p className="flex items-center gap-3 text-lg"><MdSecurity /> Your data in YouTube</p>
//                                         <p className="flex items-center gap-3 text-lg"><IoLanguageOutline /> Language: English</p>
//                                         <p className="flex items-center gap-3 text-lg"><CiLocationOn /> Location: India</p>
//                                         <p className="flex items-center gap-3 text-lg"><FaKeyboard /> Keyboard shortcuts</p>
//                                     </div>
//                                     <hr />
//                                     <div className="flex flex-col gap-2">
//                                         <p className="flex items-center gap-3 text-lg"><CiSettings /> Settings</p>
//                                     </div>
//                                     <hr />
//                                     <div className="flex flex-col gap-2">
//                                         <p className="flex items-center gap-3 text-lg"><IoIosHelpCircleOutline /> Help</p>
//                                         <p className="flex items-center gap-3 text-lg"><MdOutlineFeedback /> Send feedback</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ) : (
//                     <Link to="/login">
//                         <button className="flex items-center gap-2 px-2 py-1 border border-gray-300 rounded-full text-blue-500 text-2xl font-light hover:bg-sky-200">
//                             <PiUserCircleThin />
//                             <span className="text-sm font-bold">Sign in</span>
//                         </button>
//                     </Link>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Header;
