import IORedis from "ioredis";

const kvConnection = new IORedis({
  host: "http://localhost",
  port: 6379,
});

export default kvConnection;
