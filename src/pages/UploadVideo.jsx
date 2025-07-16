import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/upload.css";
const API_URL = import.meta.env.VITE_API_URL;

const UploadVideo = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const jwtToken = useSelector((state) => state.auth.token);
  const Channel = useSelector((state) => state.userChannel.userChannelDetails);

  const [userChannel, setUserChannel] = useState(Channel);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's channel details
    const fetchChannel = async () => {
      if (user?.channel) {
        try {
          const { data } = await axios.get(
            ` ${API_URL}/api/channel/${user?.channel}`,
            {
              headers: {
                Authorization: `JWT ${jwtToken}`,
              },
            }
          );
          setUserChannel(data.channel);
        } catch (error) {
          console.error("Error fetching channel:", error);
          toast.error("Failed to fetch channel.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChannel();
  }, [user, jwtToken]);

  useEffect(() => {
    // Redirect to home if the user doesn't have a channel
    if (!loading && (!userChannel || Object.keys(userChannel).length === 0)) {
      toast.error("You need a channel to upload videos!");
      navigate("/");
    }
  }, [userChannel, loading, navigate]);

  const [formData, setFormData] = useState({
    title: "",
    thumbnailUrl: "",
    description: "",
    videoUrl: "",
    category: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!userChannel) {
      toast.error("You must have a channel to upload videos.");
      return;
    }

    let videoData = {
      ...formData,
      uploader: user?._id,
      channelId: userChannel?._id,
    };

    try {
      let result = await axios.post(
        `${API_URL}/api/video/addVideo`,
        videoData,
        {
          headers: {
            Authorization: `JWT ${jwtToken}`,
          },
        }
      );
      if (result.data.success) {
        toast.success("Video added successfully");
        setFormData({
          title: "",
          thumbnailUrl: "",
          description: "",
          category: "",
          videoUrl: "",
        });
        navigate(`/channel/${userChannel?._id}`);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload video.");
    }
  };

  return (
    <div className="upload-video-container">
      <form onSubmit={handleFormSubmit} className="upload-form">
        <h2 className="form-title">Upload Video</h2>

        <img
          className="edit-video-thumbnail"
          src={formData?.thumbnailUrl ||
            "https://png.pngtree.com/png-vector/20190215/ourmid/pngtree-play-video-icon-graphic-design-template-vector-png-image_530837.jpg"}
          alt="video"
        />

        <label htmlFor="title">Video Title</label>
        <input id="title" type="text" required value={formData.title} name="title" onChange={handleChange} />

        <label htmlFor="thumbnailUrl">Thumbnail URL</label>
        <input id="thumbnailUrl" type="url" required value={formData.thumbnailUrl} name="thumbnailUrl" onChange={handleChange} />

        <label htmlFor="videoUrl">Video URL</label>
        <input id="videoUrl" type="url" required value={formData.videoUrl} name="videoUrl" onChange={handleChange} />

        <label htmlFor="category">Category</label>
        <select id="category" name="category" required value={formData.category} onChange={handleChange}>
          <option value="" disabled>Select a category</option>
          <option value="Travel">Travel</option>
          <option value="Fitness">Fitness</option>
          <option value="Education">Education</option>
          <option value="Movies">Movies</option>
          <option value="Food">Food</option>
          <option value="Automobile">Automobile</option>
          <option value="Songs">Songs</option>
          <option value="Finance">Finance</option>
          <option value="Gaming">Gaming</option>
          <option value="Technology">Technology</option>
          <option value="Entertainment"> Entertainment </option>
          <option value="Anime">Anime</option>
        </select>

        <label htmlFor="description">Video Description</label>
        <textarea id="description" rows={5} required value={formData.description} name="description" onChange={handleChange} />

        <button type="submit" className="upload-button">Upload</button>
      </form>
    </div>
  );
};

export default UploadVideo;