import { useState, useEffect } from "react";

export default function LocalTime({ city }) {
  const [localDateTime, setLocalDateTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocalTime = async () => {
      setLoading(true);
      setError(null);
      try {
        // First, get lat/lon for the city
        const geoResponse = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${
            import.meta.env.VITE_OPENWEATHER_API_KEY
          }`
        );
        const geoData = await geoResponse.json();
        const [cityData] = geoData;

        if (cityData) {
          const { lat, lon } = cityData;
          // Then, get the local time using TimeZoneDB API
          const timeResponse = await fetch(
            `http://api.timezonedb.com/v2.1/get-time-zone?key=${
              import.meta.env.VITE_TIMEZONEDB_API_KEY
            }&format=json&by=position&lat=${lat}&lng=${lon}`
          );
          const timeData = await timeResponse.json();

          if (timeData.status === "OK") {
            // console.log(timeData);
            const date = new Date(timeData.formatted);
            setLocalDateTime(timeData.formatted);
            // setLocalDateTime(
            //   date.toLocaleString("en-US", {
            //     weekday: "long",
            //     year: "numeric",
            //     month: "long",
            //     day: "numeric",
            //     hour: "2-digit",
            //     minute: "2-digit",
            //     second: "2-digit",
            //     timeZone: timeData.zoneName,
            //   })
            // );
          } else {
            throw new Error("Failed to fetch time data");
          }
        } else {
          throw new Error("City not found");
        }
      } catch (error) {
        console.error("Error fetching local time:", error);
        setError("Failed to fetch local time. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocalTime();
    const intervalId = setInterval(fetchLocalTime, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [city]);

  if (loading) return <div>Loading local time...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="text-lg font-semibold">
      Local Date and Time: {localDateTime}
    </div>
  );
}
