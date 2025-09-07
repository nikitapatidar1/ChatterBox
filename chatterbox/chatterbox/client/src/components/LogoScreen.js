
import { useNavigate } from "react-router-dom";

function LogoScreen() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login"); // click pe login page pe le jayega
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <img
        src="/logo.png"
        alt="Logo"
        className="w-40 h-40 cursor-pointer"
        onClick={handleClick}
      />
    </div>
  );
}

export default LogoScreen;
