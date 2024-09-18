import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

const supabaseUrl = SUPABASE_URL ?? "test";
const supabaseKey = SUPABASE_KEY ?? "test";
const supabase = createClient(supabaseUrl, supabaseKey);
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/tasks", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*");
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/api/tasks", async (req, res) => {
  const { task, status } = req.body;
  try {
    const { error } = await supabase.from("tasks").insert({
      task: task,
      status: status,
    });
    if (error) {
      res.send(error);
    }
    res.status(201).send("Task Created");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { task, status } = req.body;
  try {
    const { error } = await supabase
      .from("tasks")
      .update({
        task: task,
        status: status,
      })
      .eq("id", id);
    if (error) {
      res.send(error);
    }
    res.send("Task Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      res.send(error);
    }
    res.send("Task deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
