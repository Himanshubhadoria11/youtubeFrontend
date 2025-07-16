import "../styles/sidebar.css";
import { SiYoutubeshorts, SiYoutubegaming, SiYoutubekids, SiYoutubemusic } from "react-icons/si";
import { PiFilmSlate } from "react-icons/pi";
import { CiSettings, CiStreamOn } from "react-icons/ci";
import { IoFlagOutline, IoBagHandleOutline, IoMusicalNotesOutline, IoTrophyOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { FaHistory, FaYoutube, FaUserCircle } from "react-icons/fa";
import { FiPlusCircle } from 'react-icons/fi';
import { MdHome, MdOutlineWatchLater, MdOutlineSubscriptions, MdOutlineFeedback, MdPodcasts, MdNewspaper } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { BiChevronRight } from "react-icons/bi";
import { GoVideo } from "react-icons/go";
import { CgPlayList } from "react-icons/cg";
import { RiMeteorFill, RiGraduationCapLine } from "react-icons/ri";
import { GiHanger } from "react-icons/gi";
import { useContext } from "react";
import { newContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

function Sidebar() {
    const { isCollapse } = useContext(newContext);  // Get isCollapse from Context
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate();

    function handleUpload() {
        user?.channel ? navigate('/uploadVideo') : toast.error("Please Create channel to upload Video")
    }

    return (
        <>
            <aside className={`sidebar ${isCollapse ? "collapsed" : ""}`}>
                <div className="container1">
                    <button onClick={() => navigate('/')}><MdHome /> {!isCollapse} <span>Home</span> </button>
                    <button><SiYoutubeshorts /> {!isCollapse} <span>Shorts</span></button>
                    <button><MdOutlineSubscriptions /> {!isCollapse} <span id="subs">Subscriptions</span></button>
                    {isCollapse && (
                        <button className="usericon">
                            <FaUserCircle id="icon" />
                            <span>you</span>
                        </button>
                    )}
                </div>
                {!isCollapse && (
                    <>
                        <hr />
                        <div className="container2">
                            <button> <span> You </span> <BiChevronRight /></button>
                            <button><FaHistory /><span> History </span></button>
                            <button><CgPlayList /> <span>Playlists</span></button>
                            <button><GoVideo /> <span>Your Videos</span></button>
                            <button><MdOutlineWatchLater /> <span>Watch Later</span></button>
                            <button><AiOutlineLike /> <span>Liked Videos</span></button>
                        </div>
                        <hr />
                        <div className="container3">
                            <span>Subscriptions</span>
                        </div>
                        <hr />
                        <div className="container4">
                            <p>Explore</p>
                            <button><RiMeteorFill /> <span>Trending</span></button>
                            <button><IoBagHandleOutline /> <span>Shopping</span></button>
                            <button><IoMusicalNotesOutline /> <span>Music</span></button>
                            <button><PiFilmSlate /> <span>Movies</span></button>
                            <button><CiStreamOn /> <span>Live</span></button>
                            <button><SiYoutubegaming /> <span>Gaming</span></button>
                            <button><MdNewspaper /> <span>News</span></button>
                            <button><IoTrophyOutline /> <span>Sports</span></button>
                            <button><RiGraduationCapLine /> <span>Courses</span></button>
                            <button><GiHanger /> <span>Fashion & Beauty</span></button>
                            <button><MdPodcasts /> <span>Podcasts</span></button>
                        </div>
                        <hr />
                        <div className="container5">
                            <p>More from YouTube</p>
                            <button><FaYoutube /> <span>YouTube Premium</span></button>
                            <button><FaYoutube /> <span> YouTube Studio</span></button>
                            <button><SiYoutubemusic /> <span>YouTube Music</span></button>
                            <button><SiYoutubekids /> <span>YouTube Kids</span></button>
                        </div>
                        <hr />
                        <div className="container6">
                            <button><CiSettings /> <span>Settings</span></button>
                            <button><IoFlagOutline /> <span>Report History</span></button>
                            <button><IoIosHelpCircleOutline /> <span>Help</span></button>
                            <button><MdOutlineFeedback /> <span>Send Feedback</span></button>
                        </div>
                        <hr />
                        <div className="container7">
                            <button>About</button>
                            <button>Press</button>
                            <button>Copyright</button>
                            <button>Contact us</button>
                            <button>Creators</button>
                            <button>Advertise </button>
                            <button>Developers</button>
                        </div>
                        <div className="container7">
                            <button>Terms</button>
                            <button>Privacy</button>
                            <button>Policy & Safety</button>
                            <button>How YouTube works</button>
                            <button>Test new features</button>
                        </div>
                        <p id="copyright">&copy; 2025 Google LLC</p>
                    </>
                )}
            </aside>
            <div className="mbl-view-container">
                <button className="mbl-view-ele" onClick={() => navigate('/')}><MdHome /> </button>
                <button className="mbl-view-ele"><SiYoutubeshorts /></button>
                <button className="mbl-view-ele" onClick={() => handleUpload()}>
                    <FiPlusCircle />
                </button>
                <button className="mbl-view-ele"><MdOutlineSubscriptions /> </button>
                {user ? (
                    <button className="mbl-view-ele" onClick={() => navigate(user ? `/profile/${user._id}` : "/login")}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" className="profile-pic" />
                        ) : (
                            <div className="profile-placeholder">
                                {user?.userName?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </button>
                ) : (
                    <button className="mbl-view-ele"> <Link to={'/login'}> <FaUserCircle /> </Link></button>
                )}
            </div>
        </>
    );
}

export default Sidebar;
