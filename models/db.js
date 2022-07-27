import fs from "fs";

import chalk from "chalk";

const filename = process.env.DB_FILE;
const warn = chalk.yellowBright.bold;
const success = chalk.greenBright.bold;

export default class DB {
  static createDB() {
    if (fs.existsSync(filename)) {
      console.log(warn("DB file already exist."));
      return false;
    }
    try {
      fs.writeFileSync(filename, "[]", "utf-8");
      console.log(success("DB file created successfully."));
      return true;
    } catch (err) {
      throw new Error("Cant Write in: ", filename);
    }
  }

  static resetDB() {
    try {
      fs.writeFileSync("db.json", "[]", "utf-8");
      return true;
    } catch (err) {
      throw new Error("Cant reset DataBase " + filename);
    }
  }

  static DBExists() {
    if (fs.existsSync(filename)) {
      return true;
    } else {
      return false;
    }
  }

  static getTaskById(id) {
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(filename, "utf-8");
    } else {
      DB.createDB();
      return false;
    }
    try {
      data = JSON.parse(data);
      const task = data.find((task) => task.id === Number(id));
      return task ? task : false;
    } catch (e) {
      throw new Error("Syntax error.\nPlease check the db file: " + filename);
    }
  }

  static getTaskByTitle(title) {
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(filename, "utf-8");
    } else {
      try {
        DB.createDB();
        return false;
      } catch (er) {
        throw new Error(err.message);
      }
    }
    try {
      data = JSON.parse(data);
      const task = data.find((task) => task.title === title);
      return task ? task : false;
    } catch (err) {
      console.log("Syntax Error.\nPlease Check the db: " + filename);
    }
  }

  static getAllTasks() {
    let data;

    if (DB.DBExists()) {
      data = fs.readFileSync(filename, "utf-8");
    } else {
      try {
        DB.createDB();
        return false;
      } catch (err) {
        throw new Error(err.message);
      }
    }

    try {
      data = JSON.parse(data);
      return data;
    } catch (err) {
      console.log("Syntax Error in: " + filename);
    }
  }

  static saveTask(title, completed = false, id = 0) {
    id = Number(id);
    if (id < 0 || id !== parseInt(id)) {
      throw new Error("id must be an integer,equal or greater than zero.");
    }
    if (typeof title !== "string" || title.length < 3) {
      throw new Error("title must be string and contain at least 3 letter.");
    }

    const task = DB.getTaskByTitle(title);
    if (task && task.id != id) {
      throw new Error("A task exist with the same title.");
    }

    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(filename, "utf-8");
    }
    if (!DB.DBExists()) {
      try {
        DB.createDB();
        data = "[]";
      } catch (err) {
        throw new Error(e.message);
      }
    }

    try {
      data = JSON.parse(data);
    } catch (err) {
      throw new Error("Syntax error.\nPlease Check the DB file.");
    }

    if (id === 0) {
      if (data.length !== 0) {
        id = data[data.length - 1].id + 1;
      }
      if (data.length === 0) {
        id = 1;
      }
      data.push({
        id,
        title,
        completed,
      });

      const str = JSON.stringify(data, null, "    ");
      try {
        fs.writeFileSync(filename, str, "utf-8");
        return id;
      } catch (err) {
        throw new Error("There is a syntax Error.\nPlease Check DB database");
      }
    }
    if (id !== 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data[i].title = title;
          data[i].completed = completed;

          const str = JSON.stringify(data, null, "    ");
          try {
            fs.writeFileSync(filename, str, "utf-8");
            return id;
          } catch (err) {
            throw new Error("Cant save the task.");
          }
        }
      }
    }
  }

  static insertBulkData(data) {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        throw new Error("Invalid Data Type");
      }
    }

    if (!(data instanceof Array)) {
      throw new Error("Invalid data Type");
    }
    if (data instanceof Array) {
      data = JSON.stringify(data, null, "    ");
    }

    try {
      fs.writeFileSync(filename, data, "utf-8");
    } catch (err) {
      throw new Error("cant write in DB file");
    }
  }

  static deleteTask(id) {
    id = Number(id);

    if (id <= 0 || id !== parseInt(id)) {
      throw new Error("Task id must be positive Integer and not a float");
    }

    let data;

    try {
      data = fs.readFileSync(filename, "utf-8");
      data = JSON.parse(data);
    } catch (err) {
      throw new Error("cant read from DB file");
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data.splice(i, 1);
        data = JSON.stringify(data, null, "   ");

        try {
          fs.writeFileSync(filename, data, "utf-8");
          return true;
        } catch (err) {
          throw new Error("Cant wire in DB file.");
        }
      }
    }
    return false;
  }
}
