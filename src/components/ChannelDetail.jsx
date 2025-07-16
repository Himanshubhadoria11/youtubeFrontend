import axios from "axios";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { Link, useParams } from "react-router-dom";
import ChannelVideo from "./ChannelVideo";
import { useSelector } from "react-redux";
import "../styles/channelDetail.css";

const ChannelDetail = () => {
    const [channelData, setChannelData] = useState({});
    const [channelVideos, setChannelVideos] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const [triggerVideoFetch, setTriggerVideoFetch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [moreClick, setMoreClick] = useState(false);
    const { id } = useParams(); // Get channel ID from the URL
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Function to fetch channel data by ID
        const fetchChannelData = async () => {
            if (!id) return; // Prevents invalid API calls
            try {
                const { data } = await axios.get(`${API_URL}/api/channel/${id}`);
                if (data?.channel) {
                    setChannelData(data.channel);
                }
            } catch (error) {
                console.error("Error fetching channel data:", error);
            }
        };

        fetchChannelData();
    }, [id, API_URL]); // Fetch new channel data when the channel ID changes in the URL

    useEffect(() => {
        if (channelData?._id) {
            fetchVideos(channelData._id);
        }
    }, [channelData, triggerVideoFetch]);

    // Function to fetch videos
    const fetchVideos = async (channelId) => {
        if (!channelId) return; // Prevents invalid API calls

        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/api/video/channelVideos/${channelId}`);
            if (data?.videos) {
                setChannelVideos(data.videos);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Trigger function to re-fetch videos
    const triggerVideoFetching = () => {
        setTriggerVideoFetch((prev) => !prev);
    };

    const handleMoreClick = () => {
        setMoreClick((prev) => !prev);
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="main-channel">
                    {channelData && Object.keys(channelData).length > 0 ? (
                        <div className="upper-container">
                            <img src={channelData?.channelBanner} className="banner" alt="Channel Banner" />
                            <div className="channel-info">
                                <img src={channelData?.channelLogo} className="channel-icon" alt="Channel Logo" />
                                <div className="description">
                                    <h2 className="channel-title">{channelData?.channelName}</h2>
                                    <p>Subscribers: {channelData?.subscribers?.length}</p>
                                    <p>Channel Created on: {channelData?.createdAt?.split("T")[0]}</p>
                                    <p id="desc">
                                        {channelData?.description?.length > 100 && !moreClick ? (
                                            <>
                                                {channelData?.description?.slice(0, 96)}....
                                                <button className="more-btn" onClick={() => handleMoreClick()}> more </button>
                                            </>
                                        ) : (
                                            <>
                                                {channelData?.description}...
                                                <button className="more-btn" onClick={() => handleMoreClick()}> less </button>
                                            </>
                                        )}
                                    </p>
                                    {channelData?.owner === user?._id ? (
                                        <div className="actions">
                                            <button>Customize Channel</button>
                                            <Link to="/uploadVideo">
                                                <button className="action-btn">Upload Video</button>
                                            </Link>
                                        </div>
                                    ) : (
                                        "Welcome to my Channel"
                                    )}
                                </div>
                            </div>
                            <div className="buttons-container">
                                <button>Home</button>
                                <button>Videos</button>
                                <button>Shorts</button>
                                <button>Playlists</button>
                                <button>Posts</button>
                            </div>
                        </div>
                    ) : (
                        <h2>No Channel Found</h2>
                    )}
                    <hr />
                    <br />
                    <div className="video-box">
                        {channelVideos.length > 0 ? (
                            channelVideos.map((item) => (
                                <ChannelVideo
                                    triggerVideoFetching={triggerVideoFetching}
                                    channelData={channelData}
                                    key={item._id}
                                    item={item}
                                />
                            ))
                        ) : (
                            <h2>No videos to display</h2>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChannelDetail;
