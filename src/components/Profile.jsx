import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signout } from "../redux/authSlice";
import Loader from "../components/Loader";
import "../styles/profile.css";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // If the user doesn't have a channel, we finish loading without fetching data.
    if (!user?.channel) {
      setLoading(false);
      return;
    }

    // Fetch channel details if a channel exists
    const fetchChannelData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/channel/${user.channel}`);
        setChannelData(response.data.channel);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [user?.channel]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <div>No user logged in</div>;
  }

  return (
    <div className="profile-container">
      {user?.avatar ? (
        <div className="image-container">
          <img src={user?.avatar} alt="Profile" className="profile-pic" />
        </div>
      ) : (
        <div className="profile-placeholder">
          {user?.userName?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="profile-details">
        <h1>{user?.userName || "Channel"}</h1>
        <p>Channel: {channelData?.channelName || "No Channel"}</p>
        <br />
        <div className="custButtons">
          {user?.channel && (
            <Link to={`/channel/${user.channel}`}>
              <button>View Channel</button>
            </Link>
          )}
          <Link to={'/'}>
            <button onClick={() => dispatch(signout())}>Logout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
