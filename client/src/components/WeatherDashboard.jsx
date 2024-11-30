import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function WeatherDashboard({ forecast, error, loading }) {
  const [activeTab, setActiveTab] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [cityTimeZone, setCityTimeZone] = useState(null);

  useEffect(() => {
    const fetchTimeZone = async () => {
      try {
        // First, get lat/lon for the city
        const geoResponse = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${
            currentUser.city
          }&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const geoData = await geoResponse.json();
        const [cityData] = geoData;

        if (cityData) {
          const { lat, lon } = cityData;
          // Then, get the time zone using TimeZoneDB API
          const timeResponse = await fetch(
            `http://api.timezonedb.com/v2.1/get-time-zone?key=${
              import.meta.env.VITE_TIMEZONEDB_API_KEY
            }&format=json&by=position&lat=${lat}&lng=${lon}`
          );
          const timeData = await timeResponse.json();

          if (timeData.status === "OK") {
            setCityTimeZone(timeData.zoneName);
          } else {
            throw new Error("Failed to fetch time zone data");
          }
        } else {
          throw new Error("City not found");
        }
      } catch (error) {
        console.error("Error fetching time zone:", error);
      }
    };

    fetchTimeZone();
  }, [currentUser.city]);

  const groupForecastByDay = () => {
    if (!forecast) return [];
    const days = {};
    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!days[date]) days[date] = [];
      days[date].push(item);
    });
    return Object.values(days).slice(0, 3);
  };

  const formatLocalTime = (timestamp) => {
    if (!cityTimeZone) return "Loading...";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: cityTimeZone,
    });
  };

  if (loading)
    return <div className="text-center p-4">Loading weather data...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const days = groupForecastByDay();

  return (
    <div className="mt-6 border rounded-lg shadow-sm">
      <div className="flex border-b">
        {["Today", "Tomorrow", "Day After"].map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === index
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4">
        <div className="grid grid-cols-4 gap-4">
          {days[activeTab]?.map((hour) => (
            <div
              key={hour.dt}
              className="p-3 bg-gray-50 rounded-lg text-center"
            >
              <div className="font-medium">{formatLocalTime(hour.dt)}</div>
              <img
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt={hour.weather[0].description}
                className="mx-auto"
              />
              <div className="text-lg font-bold">
                {Math.round(hour.main.temp)}°C
              </div>
              <div className="text-sm text-gray-500">
                {hour.weather[0].description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
