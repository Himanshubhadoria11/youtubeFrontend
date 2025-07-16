import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { BiLike, BiDislike } from "react-icons/bi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { newContext } from "../App";
import Comment from "../pages/Comment";
import time from "../utils/time";
import formatViews from "../utils/formatViews";
import "../styles/videoView.css";

const VideoView = () => {
  const { _id: video } = useParams();
  const [videoData, setVideoData] = useState({});
  const [comments, setComments] = useState([]);
  const [channelData, setChannelData] = useState({});
  const [channelVideos, setChannelVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [comment, setComment] = useState("");
  const [commentTrigger, setCommentTrigger] = useState(false);
  const [moreClick, setMoreClick] = useState(false);
  const [isSubscribe, setIsSubscribed] = useState(false);
  const [moreComments, setMoreComments] = useState(false);
  const [visibleComments, setVisibleComments] = useState(2);

  const { isCollapse, setIsCollapse } = useContext(newContext); // Get sidebar state
  const isSigned = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const API_URL = import.meta.env.VITE_API_URL;

  // Like video
  const handleLike = async () => {
    if (!isSigned) {
      console.log("User is not signed in"); // Debugging
      return toast.error("Please Login to like the Video");
    }
    try {
      const uId = user._id;
      const { data } = await axios.put(
        video ? `${API_URL}/api/video/likeVideo/${video}` : null,
        { uId },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      console.log("video Data : ", data);
      if (data) {
        toast.success("Video liked");
        setVideoData((prev) => ({
          ...prev,
          likes: data.video.likes,
          dislikes: data.video.dislikes,
        }));
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  // Dislike video
  const handleDisLike = async () => {
    if (!isSigned) {
      return toast.error("Login first");
    }
    try {
      const uId = user._id;
      const { data } = await axios.put(
        video ? `${API_URL}/api/video/disLikeVideo/${video}` : null,
        { uId },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      if (data) {
        toast.success("Video disliked");
        setVideoData((prev) => ({
          ...prev,
          dislikes: data.video.dislikes,
          likes: data.video.likes,
        }));
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch video details
    const fetchData = async () => {
      const { data } = await axios.get(
        video ? `${API_URL}/api/video/${video}` : null
      );
      if (data) {
        setVideoData(data.video);
        fetchChannelData(data.video.channelId);
        fetchChannelVideos(data.video.channelId);
        if (data.video.videoUrl) {
          // Assuming videoUrl has a query parameter "v=" (like YouTube URLs)
          const parts = data.video.videoUrl.split("v=");
          setVideoUrl(parts[1] ? parts[1] : "");
        }
      }
    };

    fetchData();
  }, [video]);

  useEffect(() => {
    if (videoData && videoData._id) {
      fetchVideoComments();
    }
  }, [videoData, commentTrigger]);

  // Fetch channel videos
  const fetchChannelVideos = async (id) => {
    try {
      const { data } = await axios.get(
        id ? `${API_URL}/api/video/channelVideos/${id}` : null
      );
      if (data) {
        setChannelVideos(data.videos);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch channel data
  const fetchChannelData = async (cId) => {
    const { data } = await axios.get(
      cId ? `${API_URL}/api/channel/${cId}` : null
    );
    if (data) {
      setChannelData(data.channel);
    }
  };

  // handle more click
  const handleMoreClick = () => {
    setMoreClick((prev) => !prev);
  };

  //handle moreComments 
  const handleMoreComments = () => {
    setMoreComments((prev) => !prev);
    setVisibleComments((prev) => (prev === 2 ? comments.length : 2));
  };

  // Fetch video comments
  const fetchVideoComments = async () => {
    const { data } = await axios.get(
      video ? `${API_URL}/api/comment/videoComments/${video}` : null
    );
    if (data) {
      setComments(data.comments);
    }
  };

  // Toggle comment re-fetch
  const triggerCommentFetch = async () => {
    setCommentTrigger((prev) => !prev);
  };

  // Handle adding a comment
  const handleComment = async () => {
    if (comment.trim() === "") {
      return toast.error("Comment cannot be empty!");
    }
    if (!isSigned) {
      return toast.error("Login required");
    }
    const commentData = {
      video: videoData._id,
      owner: user._id,
      description: comment,
    };
    try {
      const response = await axios.post(
        `${API_URL}/api/comment/addComment`,
        commentData
      );
      if (response.data) {
        toast.success("Comment added");
        fetchVideoComments();
        setComment("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  // Handle channel subscription & unsubscription
  const handleSubscribe = async () => {
    if (!isSigned) {
      return toast.error("Login first");
    }

    try {
      const { data } = await axios.put(
        `${API_URL}/api/channel/subscribeChannel/${channelData._id}/${user._id}`,
        {},
        { headers: { Authorization: `JWT ${token}` } }
      );

      if (data.success) {
        setIsSubscribed((prev) => !prev); // Toggle subscription status immediately
        toast.success(data.message || (isSubscribe ? "Unsubscribed" : "Subscribed"));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };
  return (
    <div className="video_View_Container">
      {/* Left Section: Video, Details, and Comments */}
      <div className="video-left">
        <iframe className="video-iframe" src={`https://www.youtube.com/embed/${videoUrl}`}
          title={`${videoData.title}`} frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>

        <div className="operations">
          <h2 id="video-title">{`${videoData?.title}`} </h2>
          <div className="video-operations">
            <div className="left-group">
              <Link to={`/channel/${channelData._id}`} className="channel-link">
                <img
                  id="logo"
                  src={channelData.channelLogo}
                  alt="Channel logo"
                />
                <h2 className="channel-name">{channelData.channelName}</h2>
              </Link>

              <button onClick={handleSubscribe} className={`subscribe-btn ${isSubscribe ? "subscribed" : ""}`} >
                {isSubscribe ? "Subscribed" : "Subscribe"}
              </button>
            </div>
            <div className="extra-information">
              <button onClick={handleLike} className="like-btn">
                <BiLike />
                <span>|</span>
                {videoData?.likes ? videoData?.likes.length : 0}
              </button>
              <button onClick={handleDisLike} className="dislike-btn">
                <BiDislike />
                <span>|</span>
                {videoData?.dislikes ? videoData?.dislikes.length : 0}
              </button>
              <button className="share-btn"> share </button>
              <button className="save-btn">save</button>
            </div>
          </div>
        </div>

        <div className="description-section">
          <div className="views-time">
            <p>{formatViews(videoData?.views)} Views •</p>
            <p>{time(videoData?.createdAt)}</p>
          </div>
          <p className="description-text">
            {videoData?.description?.length > 100 && !moreClick ? (
              <>
                {videoData?.description?.slice(0, 96)}....
                <button className="more-btn" onClick={() => handleMoreClick()}> more </button>
              </>
            ) : (
              <>
                {videoData?.description}...
                <button className="more-btn" onClick={() => handleMoreClick()}> less </button>
              </>

            )}
          </p>
        </div>

        <div className="comment-section">
          <input type="text" name="comment" className="comment-bar" onChange={(e) => setComment(e.target.value)} value={comment} placeholder="comment here" />
          <button onClick={handleComment}>Comment</button>
        </div>

        {comments.length > 2 && (
          <button className="more-btn" onClick={handleMoreComments}>
            {moreComments ? "Less Comments" : "More Comments"}
          </button>
        )}

        <div className="comments-list">
          {comments && comments.length > 0 ? (
            comments.slice(0, visibleComments).map((item) => (
              <Comment
                triggerCommentFetch={triggerCommentFetch}
                video={video}
                key={item._id}
                id={item._id}
                createdAt={item.createdAt}
                owner={item.owner}
                description={item.description}
              />
            ))
          ) : (
            "No comments to display"
          )}
        </div>
      </div>
      {/* Right Section: Related Videos */}
      <div className="sideView">
        <h2 className="sideView-title">Channel related videos</h2>
        <div className="sideVideosList">
          {channelVideos && channelVideos.length > 0
            ? channelVideos.map((item) => (
              <Link to={`/watch/${item._id}`} key={item._id} className="boxVideo">
                <img className="box-video-img" src={item.thumbnailUrl} alt="video thumbnail" loading="lazy" />
                <div className="details">
                  <h2>
                    {item.title.length > 55
                      ? item.title.slice(0, 55) + "..."
                      : item.title}
                  </h2>
                  <h2>{channelData.channelName}</h2>
                  <h2>
                    {formatViews(item.views)} • {time(item.createdAt)}
                  </h2>
                </div>
              </Link>
            ))
            : "No videos related to channel"}
        </div>
      </div>
    </div>
  );
};

export default VideoView;

