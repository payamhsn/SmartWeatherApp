import WeatherDashboard from "../components/WeatherDashboard";
import EditProfileModal from "../components/EditProfileModal";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import WeatherWarnings from "../components/WeatherWarnings";
import LocalTime from "../components/LocalTime";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${
            currentUser.city
          }&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        // console.log(data);
        if (!response.ok) throw new Error(data.message);
        setForecast(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [currentUser.city]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <header className="flex flex-col mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">
            Hello, {currentUser.username}
          </h1>
          <div>
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
            >
              Edit Profile
            </button>
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete Profile
            </button>
          </div>
        </div>
        <LocalTime city={currentUser.city} />
      </header>
      <WeatherDashboard forecast={forecast} loading={loading} error={error} />

      {/* Rest of your dashboard content goes here */}

      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal onClose={() => setShowDeleteModal(false)} />
      )}
      <WeatherWarnings forecast={forecast} loading={loading} error={error} />
    </div>
  );
}
