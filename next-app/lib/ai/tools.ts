import { tool } from "ai";
import { z } from "zod";
import axios from "axios";
import { evaluate } from "mathjs";

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

function calculatorTool() {
  return tool({
    description: "Calculate a mathematical expression",
    inputSchema: z.object({
      expression: z
        .string()
        .describe(
          'The mathematical expression which needs to be calculated. Expressions will be calculated in "mathjs" library. Examples: "2 + 3 * 4", "(10 + 5) / 3","sin(π/2) + cos(0)","sqrt(16) * 2^3","100 * 1.08^5","log10(100)","min(5, 10, 2)"',
        ),
    }),
    execute: async ({ expression }) => {
      const errorMessage = "Unable to calculate the expression";

      try {
        // Evaluate the mathematical expression safely
        const result = evaluate(expression);

        let response;

        // Format output nicely (avoid scientific notation for simple numbers)
        if (typeof result === "number" && Number.isFinite(result)) {
          response =
            result % 1 === 0
              ? result.toString()
              : result.toFixed(6).replace(/\.?0+$/, "");
        } else {
          response = result.toString();
        }

        if (!response) return { response: errorMessage };

        return { response };
      } catch (error) {
        console.error("ERROR: Calculator Tool", error);
        return { response: errorMessage };
      }
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

export { weatherTool, calculatorTool, webSearchTool };
