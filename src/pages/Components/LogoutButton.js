import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from "react-router-dom";
import "../../assets/css/logout.css";
const LogoutButton = () => {
  const navigate = useNavigate();
  const signOut = useSignOut();

  const handleLogout = () => {
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="container">
      <button
        onClick={handleLogout}
        className="btn btn-border-4"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
