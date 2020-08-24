const Bull = require("bull");
const redisConfig = require("../config/redis");

const jobs = require("../jobs");

const queues = Object.values(jobs).map((job) => ({
  bull: new Bull(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
}));

const Queue = {
  queues,
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle);
      queue.bull.on("failed", (job, err) => {
        console.log("Job failed", queue.key, job.data);
        console.log(err);
      });
    });
  },
};

module.exports = Queue;
