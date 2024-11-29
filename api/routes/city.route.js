import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/suggestions", async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get(
      `http://api.geonames.org/searchJSON?name_startsWith=${query}&maxRows=5&username=payamhoseini`
    );
    const cities = response.data.geonames.map((city) => ({
      name: city.name,
      country: city.countryName,
    }));
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch city suggestions" });
  }
});

export default router;
