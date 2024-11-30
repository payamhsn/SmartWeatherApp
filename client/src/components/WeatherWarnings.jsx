import React, { useState, useEffect } from "react";

const WeatherWarnings = ({ forecast }) => {
  const [warnings, setWarnings] = useState({
    temperature: null,
    precipitation: null,
  });

  const TEMP_CHANGE_THRESHOLD = 5; // °C
  const PRECIP_TYPES = ["Rain", "Snow", "Thunderstorm"];

  const analyzeWeatherData = (data) => {
    const weatherList = data.list;
    let tempWarning = null;
    let precipWarning = null;

    // Find significant temperature changes between consecutive periods
    for (let i = 0; i < weatherList.length - 1; i++) {
      const current = weatherList[i];
      const next = weatherList[i + 1];
      const tempDiff = next.main.temp - current.main.temp;

      if (Math.abs(tempDiff) >= TEMP_CHANGE_THRESHOLD) {
        const time = new Date(next.dt * 1000);
        const formattedTime = time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedDate = time.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });

        tempWarning = {
          diff: Math.abs(tempDiff.toFixed(1)),
          direction: tempDiff > 0 ? "rise" : "drop",
          time: formattedTime,
          date: formattedDate,
        };
        break; // Only report the first significant change
      }
    }

    // Find upcoming precipitation
    for (let i = 0; i < weatherList.length; i++) {
      const forecast = weatherList[i];
      if (PRECIP_TYPES.includes(forecast.weather[0].main)) {
        const time = new Date(forecast.dt * 1000);
        const formattedTime = time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedDate = time.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });

        precipWarning = {
          type: forecast.weather[0].main.toLowerCase(),
          time: formattedTime,
          date: formattedDate,
        };
        break; // Only report the first upcoming precipitation
      }
    }

    setWarnings({
      temperature: tempWarning,
      precipitation: precipWarning,
    });
  };

  useEffect(() => {
    if (forecast?.list?.length > 0) {
      analyzeWeatherData(forecast);
    }
  }, [forecast]);

  if (!forecast?.list) {
    return null;
  }

  if (!warnings.temperature && !warnings.precipitation) {
    return (
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
        <p className="text-green-700">
          No significant weather changes expected.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mt-4 space-y-2">
      <h2 className="text-lg font-semibold text-orange-800 mb-3">
        Weather Alerts
      </h2>

      {warnings.temperature && (
        <div className="p-3 rounded bg-orange-100 text-orange-800">
          Temperature will {warnings.temperature.direction} by{" "}
          {warnings.temperature.diff}°C around {warnings.temperature.time} on{" "}
          {warnings.temperature.date}
        </div>
      )}

      {warnings.precipitation && (
        <div className="p-3 rounded bg-blue-100 text-blue-800">
          Expect {warnings.precipitation.type} starting at{" "}
          {warnings.precipitation.time}
          on {warnings.precipitation.date}
        </div>
      )}
    </div>
  );
};

export default WeatherWarnings;
