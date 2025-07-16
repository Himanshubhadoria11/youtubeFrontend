import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import formatViews from "../utils/formatViews";
import time from "../utils/time";
import "../styles/searchVideoView.css";

const SearchVideoView = ({ item }) => {
  const [channelData, setChannelData] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Function to fetch channel data based on channel ID
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          item?.channelId ? `${API_URL}/api/channel/${item?.channelId}` : null
        );
        if (data) {
          setChannelData(data.channel);
        }
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };
    fetchData();
  }, [item?.channelId]);

  return (
    <Link to={`/watch/${item?._id}`} className="search-video-container">
      <img className="search-view-thumbnail" src={item?.thumbnailUrl} alt="video thumbnail" />

      <div className="search-video-data">
        <div className="search-video-info">
          <h2 className="search-video-title">{item?.title}</h2>
          <p className="search-video-stats">
            {formatViews(item?.views)} views • {time(item?.createdAt)}
          </p>
        </div>

        <div className="search-channel-info">
          <img className="search-channel-logo" src={channelData?.channelLogo} alt="channel logo" />
          <h2 className="search-channel-name">{channelData?.channelName}</h2>
        </div>

        <p className="video-description">
          {item?.description.length > 198 ? item?.description.slice(0, 198) + "..." : item?.description}
        </p>
      </div>
    </Link>
  );
};

export default SearchVideoView;

// 67b30824f58b6147bd7dd778 
// 67b30824f58b6147bd7dd778
