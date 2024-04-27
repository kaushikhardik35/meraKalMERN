const { User, Task } = require("../db_models/userAndTask");
const axios = require("axios");

module.exports.createTask = async (task) => {
  const { endpoint, data, delay, method, userId } = task;
  const result = await Task.create({
    endpoint,
    data: JSON.stringify(data),
    delay,
    method,
    userId,
    status: "queued",
  });

  setTimeout(async () => {
    try {
      const updatedTask = await Task.findById(result._id);
      if (updatedTask && updatedTask.status === "queued") {
        const response = await axios({
          method: method,
          url: endpoint,
          data: data,
        });

        updatedTask.status = "complete";
        await updatedTask.save();
        console.log(`Request sent to ${endpoint} successfully.`);
      }
    } catch (error) {
      console.error(`Error sending request to ${endpoint}:`, error.message);
      const failedTask = await Task.findById(result._id);
      if (failedTask) {
        failedTask.status = "failed";
        await failedTask.save();
      }
    }
  }, delay);

  return result;
};

module.exports.getTasksByUserId = async (userId) => {
  const result = await Task.find({ userId: userId });
  return result;
};

module.exports.getAllTasks = async () => {
  const result = await Task.find({});
  return result;
};
