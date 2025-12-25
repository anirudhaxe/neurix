import { Innertube, ClientType } from "youtubei.js";
import { exec } from "child_process";

/**
 * Inner tube client to access youtube api
 **/
const yt = await Innertube.create({
  client_type: ClientType.ANDROID, // Use ANDROID client to avoid signature deciphering issues
  player_id: "0004de42",
});

/**
 * Helper function to extract video id from different types of yt URL
 **/
function extractYoutubeVideoId(input: string) {
  try {
    const url = new URL(input);
    if (
      url.hostname.includes("youtube.com") ||
      url.hostname.includes("youtu.be")
    ) {
      // Standard video: ?v=ID
      if (url.searchParams.has("v")) {
        return url.searchParams.get("v");
      }
      // Short: /shorts/ID
      if (url.pathname.includes("/shorts/")) {
        return url.pathname.split("/shorts/")[1].split("/")[0];
      }
      // youtu.be/ID
      if (url.hostname === "youtu.be") {
        return url.pathname.slice(1);
      }
    }
  } catch (e) {
    // Not a valid URL
    console.error(e);
    return null;
  }
  return null;
}

/**
 * Helper function to convert audio file format from m4a to wav
 * IMPORTANT: Uses ffmpeg as external dependency, make sure ffmpeg is installed on host
 **/
const convertM4aToWav = (
  inputPath: string,
  outputPath: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(
      `ffmpeg -i "${inputPath}" -ar 16000 "${outputPath}"`,
      // (error, stdout, stderr) => {
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
};

export { yt, extractYoutubeVideoId, convertM4aToWav };
