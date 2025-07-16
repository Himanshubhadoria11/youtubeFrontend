import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signin } from '../redux/authSlice'
import { setUserChannelDetails } from "../redux/userChannelSlice";
import "../styles/channelform.css";

const CreateChannel = () => {
    const dispatch = useDispatch();
    const userChannel = useSelector((state) => state.userChannel.userChannelDetails);
    const user = useSelector((state) => state.auth.user);
    const jwtToken = useSelector((state) => state.auth.token);
    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        channelLogo: "",
        channelName: "",
        description: "",
        channelBanner: "",
        owner: user?._id,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Function to create a channel
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let channelData = { ...formData, owner: user?._id };

        try {
            let result = await axios.post(
                `${API_URL}/api/channel/createChannel`,  // Correct API URL
                channelData,
                {
                    headers: {
                        Authorization: `JWT ${jwtToken}`,
                    },
                }
            );

            console.log("result data", result?.data)
            if (result?.data) {
                toast.success("Channel created successfully");
                console.log("API Response:", result.data);

                // Update Redux auth state with the new channel ID
                dispatch(signin({ user: result?.data?.updatedUser, jwtToken: jwtToken }));

                // Fetch and update user details in Redux
                await fetchCurrentUser();
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    };

    // Function to fetch updated user details and update Redux
    const fetchCurrentUser = async () => {
        try {
            let { data } = await axios.get(
                `${API_URL}/api/users/${user?._id}`,
                {
                    headers: {
                        Authorization: `JWT ${jwtToken}`,
                    },
                }
            );

            if (data?.user) {
                console.log("Updated User Data:", data.user);
                dispatch(setUserChannelDetails(data.user)); // Update userChannel state
                dispatch(signin({ user: data.user, jwtToken })); // Update auth state (localStorage)
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    };

    useEffect(() => {
        if (userChannel && Object.keys(userChannel).length >= 1) {
            navigate("/");
        }
    }, [userChannel]);

    return (
        <div className="create-channel-container">
            <form onSubmit={handleFormSubmit} className="create-channel-form">
                <h2 className="form-title">How you will appear</h2>

                <img
                    className="channel-logo"
                    src={
                        formData?.channelLogo ||
                        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                    }
                    alt="Channel Logo"
                />

                <label htmlFor="channelName">Channel Name</label>
                <input id="channelName" type="text" required value={formData.channelName} name="channelName" onChange={handleChange} />

                <label htmlFor="channelLogo">Channel Logo (URL)</label>
                <input id="channelLogo" type="url" required value={formData.channelLogo} name="channelLogo" onChange={handleChange} />

                <label htmlFor="channelBanner">Channel Banner (URL)</label>
                <input id="channelBanner" type="url" required value={formData.channelBanner} name="channelBanner" onChange={handleChange} />

                <label htmlFor="description">Channel Description</label>
                <input id="description" type="text" required value={formData.description} name="description" onChange={handleChange} />

                <button type="submit" className="submit-btn">
                    Create Channel
                </button>
            </form>
        </div>
    );
};

export default CreateChannel;
