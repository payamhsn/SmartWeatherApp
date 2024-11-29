import { useState, useEffect } from "react";
import Select from "react-select";

export default function CityInput({ onCitySelect }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length > 2) {
        try {
          const res = await fetch(`/api/city/suggestions?query=${inputValue}`);
          if (!res.ok) {
            throw new Error("Failed to fetch city suggestions");
          }
          const data = await res.json();
          const formattedOptions = data.map((city) => ({
            value: city.name,
            label: `${city.name}, ${city.country}`,
          }));
          setOptions(formattedOptions);
        } catch (error) {
          console.error("Failed to fetch city suggestions", error);
        }
      } else {
        setOptions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      onCitySelect(selectedOption.value);
    }
  };

  return (
    <Select
      options={options}
      onInputChange={setInputValue}
      onChange={handleChange}
      placeholder="Enter your city"
      isClearable
      isSearchable
      className="rounded-lg"
      classNamePrefix="react-select"
    />
  );
}
