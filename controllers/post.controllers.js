import Task from "../models/task.js";
import DB from "../models/db.js";

export default class PostController {
  static addTask(req, res) {
    if (!req.body.title) {
      res.status(400).send("<h1>Invalid request.</h1>");
    }
    const title = req.body.title;
    const completed = req.body.completed ? true : false;

    try {
      const task = new Task(title, completed);
      task.save();
      res.redirect("/");
    } catch (err) {
      res.send(`<h1>${err.message}</h1>`);
    }
  }

  static toggleTask(req, res) {
    if (!req.body.id) {
      res.status(400).send("<h1>Invalid request.</h1>");
      return;
    }
    const task = Task.getTaskById(Number(req.body.id));

    if (!task) {
      res.status(400).json({ error: "Task Not Found!" });
      return;
    }

    if (task) {
      task.completed = !task.completed;
      task.save();
      res.json(true);
    }
  }

  static editTask(req, res) {
    if (!req.body.title || !req.body.id) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const task = Task.getTaskById(parseInt(req.body.id));
    const title = req.body.title;

    if (!task) {
      res.status(400).json({ error: "Task not found" });
      return;
    }

    try {
      task.title = title;
      task.save();
      res.json(true);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static deleteTask(req, res) {
    if (!req.body.id) {
      res.status(400).json({ error: "Invalid Request." });
      return;
    }

    try {
      if (!DB.deleteTask(req.body.id)) {
        res.status(400).json("Task Not Found");
        return;
      }
      res.json(true);
    } catch (err) {
      res.status(500).json({ error: "server Error" });
    }
  }
}
