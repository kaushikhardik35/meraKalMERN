const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const {
  createTask,
  getTasksByUserId,
  getAllTasks,
} = require("../controllers/taskService");
const { Tasks } = require("../db_models/userAndTask");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    let { endpoint, delay, method } = req.query;
    if (!endpoint) {
      return res.status(400).json({ error: "Please Enter valid Endpoint" });
    }
    if (!method) {
      method = "GET";
    }
    const { userId } = req.user;
    console.log(req.body);
    const parsedDelay = parseInt(delay, 10);

    const task = {
      endpoint: endpoint,
      data: req.body,
      delay: parsedDelay || 0,
      method: method,
      userId: userId,
      status: "queued",
    };

    const createdTask = await createTask(task);
    res.status(201).json(createdTask);
  } catch (error) {
    console.error("POST /tasks error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    const { userId } = req.user;

    const tasks = await getTasksByUserId(userId);

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await getAllTasks();

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
