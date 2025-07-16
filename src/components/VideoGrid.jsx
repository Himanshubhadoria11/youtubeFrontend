import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";
import "../styles/videoGrid.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./Loader";

function VideoGrid() {
  const isSigned = useSelector((state) => state.auth.isAuthenticated);

  const [videos, setVideos] = useState([]);
  const [filteredData, setFilteredData] = useState(videos);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;


  // Fetch videos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_URL}/api/video`
        );
        if (data) {
          setVideos(data.videos);
          setFilteredData(data.videos);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // Handle category filter
  const handleFilter = (filteredItem) => {
    if (filteredItem === "All") {
      setFilteredData(videos);
    } else {
      setFilteredData(
        videos.filter(
          (item) => item.category.toLowerCase() === filteredItem.toLowerCase()
        )
      );
    }
  };

  const categories = [
    "All",
    "Travel",
    "Fitness",
    "Entertainment",
    "Movies",
    "Food",
    "Automobile",
    "Songs",
    "Finance",
    "Gaming",
    "Technology",
    "Anime"
  ];

  return (
    <>
      {/*  Category  */}
      <div className="category">
        {categories?.map((item) => (
          <span onClick={() => handleFilter(item)} key={item} className="category-item" >
            {item}
          </span>
        ))}
      </div>

      <div className="video-container1">
        {loading ? (
          <Loader />
        ) : (
          <>
            {filteredData && filteredData.length >= 1 ? (
              filteredData.map((item) => (
                <VideoCard
                  key={item._id}
                  videoId={item._id}
                  title={item.title}
                  channelId={item.channelId}
                  thumbnailUrl={item.thumbnailUrl}
                  views={item.views}
                  createdAt={item.createdAt}
                />
              ))
            ) : (
              <h2>No videos to display</h2>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default VideoGrid;
