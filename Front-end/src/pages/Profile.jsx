import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, logoutUser } from "../services/auth";
function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleLogout = async () => {
    await logoutUser();

    navigate("/login");
  };

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        setUser(data.user);

        setFormData({
          name: data.user.name,
          email: data.user.email,
        });
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await updateProfile(formData);

      setUser(data.user);

      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Profile update failed");
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>My Profile</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <button type="submit">Update Profile</button> <br />
        <button onClick={handleLogout}>Logout</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;
