import { extractYoutubeVideoId, yt, convertM4aToWav } from "./utils";
import fs from "fs";
import path from "path";
import { Readable } from "node:stream";
import { pipeline } from "@xenova/transformers";
import wavefile from "wavefile";
import { randomUUID } from "node:crypto";

const transcribeYtVideo = async (videoLink: string) => {
  try {
    const videoId = extractYoutubeVideoId(videoLink);

    if (!videoId) return null;

    console.info("INFO: YT Video id to be processed: ", videoId);

    const stream = await yt.download(videoId, {
      type: "audio",
      quality: "best",
      format: "mp4",
    });

    const audioFileId = `${videoId}-${randomUUID()}`;

    // const m4aPath = path.resolve(process.cwd(), `${audioFileId}.m4a`);
    // const wavPath = path.resolve(process.cwd(), `${audioFileId}.wav`);
    const m4aPath = path.resolve("/tmp", `${audioFileId}.m4a`);
    const wavPath = path.resolve("/tmp", `${audioFileId}.wav`);

    const writeStream = fs.createWriteStream(m4aPath);

    const nodeStream = Readable.fromWeb(stream as any);

    await new Promise((resolve, reject) => {
      nodeStream.pipe(writeStream);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.info("INFO: Audio file saved:", m4aPath);

    await convertM4aToWav(m4aPath, wavPath);

    console.info("INFO: Converted audio file to WAV:", wavPath);

    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en",
    );

    const buffer = await fs.promises.readFile(wavPath);

    // Read .wav file and convert it to required format
    let wav = new wavefile.WaveFile(new Uint8Array(buffer));

    wav.toBitDepth("32f"); // Pipeline expects input as a Float32Array

    // already doing this while converting to wav using ffmpeg using -ar
    // wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000

    let audioData = wav.getSamples();

    // if there are multiple channels for the audio file, we just select the first one
    if (Array.isArray(audioData)) {
      audioData = audioData[0];
    }

    let start = performance.now();
    let output = await transcriber(audioData, {
      // chunking the audio data to improve whispers accuracy for clips longer then 30s
      chunk_length_s: 30, // Process in 30-second chunk
      stride_length_s: 5, // 5-second overlap between chunks
    });
    let end = performance.now();

    console.info(
      `YT Transcriber execution duration for ${wavPath}: ${(end - start) / 1000} seconds`,
    );

    // unlink the created files from fs
    fs.unlink(m4aPath, (err) => {
      if (err) console.error(err);
    });
    fs.unlink(wavPath, (err) => {
      if (err) console.error(err);
    });

    if (Array.isArray(output)) output = output[0];

    if (output.text) {
      return output.text;
    } else {
      return null;
    }
  } catch (error) {
    console.error("ERROR: YT Transcriber:", error);
    return null;
  }
};

export default transcribeYtVideo;
