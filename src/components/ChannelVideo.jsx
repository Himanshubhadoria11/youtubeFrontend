import { useState, useContext } from "react";
import { newContext } from "../App";
import { CiEdit } from "react-icons/ci";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import time from "../utils/time";
import { useSelector } from "react-redux";
import formatViews from "../utils/formatViews";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/channelVideo.css";

const ChannelVideo = ({ triggerVideoFetching, item, channelData }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { isCollapse } = useContext(newContext);
  const [op, setOp] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Function to delete a video
  const handleDelete = async (videoId) => {
    try {
      const result = await axios.delete(
        `${API_URL}/api/video/deleteVideo/${videoId}/${channelData?._id}/${user?._id}`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      if (result) {
        toast.success("Video deleted successfully");
        triggerVideoFetching(); // Refresh the video list
      }
    } catch (error) {
      console.log(error);
      toast.error(" Please Login, if you are already logged in ? log in again to complete the action");
    } finally {
      setOp(false);
    }
  };

  return (
    <div className={`video-card${isCollapse ? "ChCollapse" : ""}`}>
      <div>
        <Link to={`/watch/${item._id}`}>
          <img
            src={item.thumbnailUrl}
            alt={item.title.slice(0, 10) + "..."}
            className="video-thumbnail"
          />
        </Link>
      </div>
      <div className="video-info">
        <div className="description">
          <h2 className="video-title">
            {item?.title?.length > 72 ? item?.title.slice(0, 72) + "..." : item?.title}
          </h2>
          <p className="video-meta">
            {formatViews(item?.views)} views • {time(item?.createdAt)}
          </p>
        </div>
        <div className="video-options">
          {user?._id === channelData?.owner && (
            <>
              <HiOutlineDotsVertical onClick={() => setOp(!op)} className="options-icon" />
              <ul className={`options-menu ${op ? "show" : "hide"}`}>
                <li
                  onClick={() => {
                    setOp(false);
                    navigate(`/editVideo/${item._id}`);
                  }}
                  className="option-item"
                >
                  <CiEdit />
                  Edit
                </li>
                <li onClick={() => handleDelete(item._id)} className="option-item">
                  <MdDeleteOutline />
                  Delete
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelVideo;