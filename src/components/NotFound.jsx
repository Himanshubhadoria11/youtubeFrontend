import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/notFound.css"; 

const NotFound = () => {
  const isSigned = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <h2 className="error-code">404</h2>
      <h2 className="error-message">Page Not Found</h2>
      <button className="error-button" onClick={ () => navigate('/')}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;