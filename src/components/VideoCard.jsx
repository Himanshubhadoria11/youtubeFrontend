import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/videoCard.css";
import time from '../utils/time';
import formatViews from '../utils/formatViews';
import { newContext } from "../App";

function VideoCard({ videoId, title, thumbnailUrl, channelId, views, createdAt }) {
    const [channelData, setChannelData] = useState({});
    const { isCollapse } = useContext(newContext);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Fetch channel details
        let isMounted = true;
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    channelId ? `${API_URL}/api/channel/${channelId}` : null
                );
                if (data) {
                    setChannelData(data.channel);
                }
            } catch (error) {
                console.error("Error fetching channel data:", error);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [channelId]);

    return (
        <div className={`VideoCard${isCollapse ? "VCcollapsed" : ""}`}>
            {/* Thumbnail */}
            <Link to={`/watch/${videoId}`}>
                <img src={thumbnailUrl || ""} alt={title} className="thumbnailImage" />
            </Link>

            {/* Video Info */}
            <div className="videIinfo">
                <Link to={`/channel/${channelId}`}>
                    <img className="channelLogo" src={channelData.channelLogo || " img "} />
                </Link>
                <div className="videoDetails">
                    <Link to={`/watch/${videoId}`}>
                        <h3 className="videoTitle">{title.length > 62 ? title.slice(0, 54) + "..." : title}</h3>
                    </Link> 

                    <Link to={`/channel/${channelId}`}>
                        <p className="channelName">{channelData?.channelName}</p>
                    </Link>
                    <span className="views">{formatViews(views)} Views • {time(createdAt)}</span>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
