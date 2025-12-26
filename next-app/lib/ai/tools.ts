import { tool } from "ai";
import { z } from "zod";
import axios from "axios";

function weatherTool() {
  return tool({
    description: "Get the weather of a city",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      const errorMessage = "Unable to get weather";

      // Fetch Geocode
      const geoResponse = await axios
        .get(`https://geocoding-api.open-meteo.com/v1/search`, {
          params: { name: city, count: 1 },
        })
        .catch((error) => {
          console.error("ERROR: Weather Tool", error);
          return null;
        });

      if (
        !geoResponse ||
        !geoResponse.data.results ||
        geoResponse.data.results.length === 0
      ) {
        return { response: errorMessage };
      }

      const { latitude, longitude } = geoResponse.data.results[0];

      // Fetch Weather
      const weatherResponse = await axios
        .get(`https://api.open-meteo.com/v1/forecast`, {
          params: {
            latitude,
            longitude,
            current_weather: true,
            hourly: "temperature_2m,precipitation",
            // Add more parameters as needed
          },
        })
        .catch((error) => {
          console.error("ERROR: Weather Tool", error);
          return null;
        });

      if (!weatherResponse || !weatherResponse.data)
        return { response: errorMessage };

      return { response: weatherResponse.data };
    },
  });
}

function convertFahrenheitToCelsiusTool() {
  return tool({
    description: "Convert a temperature in fahrenheit to celsius",
    inputSchema: z.object({
      temperature: z
        .number()
        .describe("The temperature in fahrenheit to convert"),
    }),
    execute: async ({ temperature }) => {
      const celsius = Math.round((temperature - 32) * (5 / 9));
      return {
        celsius,
      };
    },
  });
}

function webSearchTool() {
  return tool({
    description: "Search the web for up-to-date information",
    inputSchema: z.object({
      query: z.string().describe("The query to be searched on the web"),
    }),
    execute: async ({ query }) => {
      const errorMessage = "Web search tool currently not available";

      const apiKey = process.env.TAVILY_SEARCH_API_KEY;

      if (!apiKey) return { response: errorMessage };

      const response = await axios
        .post(
          "https://api.tavily.com/search",
          { query },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          },
        )
        .catch((error) => {
          console.error("ERROR: Web Search Tool", error);
          return null;
        });

      if (!response || !response.data) return { response: errorMessage };

      return {
        response: response.data,
      };
    },
  });
}

export { weatherTool, convertFahrenheitToCelsiusTool, webSearchTool };
