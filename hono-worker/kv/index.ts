import IORedis from "ioredis";

const kvConnection = new IORedis({
  host: "localhost",
  port: 6379,
  // setting maxRetriesPerRequest to null as this kv connection has to be used with workers
  maxRetriesPerRequest: null,
});

export default kvConnection;
