import { tool } from "ai";
import { z } from "zod";
import axios from "axios";

function weatherTool() {
  return tool({
    description: "Get the weather in a location (fahrenheit)",
    inputSchema: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }) => {
      const temperature = Math.round(Math.random() * (90 - 32) + 32);
      return {
        location,
        temperature,
      };
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
          return { data: errorMessage };
        });

      if (!response.data) return { response: errorMessage };

      return {
        response: response.data,
      };
    },
  });
}

export { weatherTool, convertFahrenheitToCelsiusTool, webSearchTool };
