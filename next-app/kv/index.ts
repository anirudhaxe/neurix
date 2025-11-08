import IORedis from "ioredis";

const kvConnection = new IORedis({
  host: "localhost",
  port: 6379,
});

export default kvConnection;
