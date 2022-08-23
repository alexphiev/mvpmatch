import express from "express";
import { QueryFailedError, TypeORMError } from "typeorm";
import UserController from "../controllers/user.controller";
import { auth } from "../middlewares/authJWT.middleware";

const router = express.Router();

router.get("/", auth, async (_req, res) => {
  const controller = new UserController();
  const response = await controller.getUsers();
  return res.send(response);
});

router.post("/", async (req, res) => {
  const controller = new UserController();
  try {
    const response = await controller.createUser(req.body);
    return res.send(response);
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    switch ((error as Error).constructor) {
      case QueryFailedError: 
        return res.status(400).send({ error: (error as QueryFailedError).driverError.detail });
      default:
        return res.status(400).send({ error: (error as Error).message });
    }
  }
});

router.get("/:id", auth, async (req, res) => {
  const controller = new UserController();
  const response = await controller.getUser(req.params.id);
  if (!response) res.status(404).send({ message: "No user found" });
  return res.send(response);
});

router.patch("/:id", auth, async (req, res) => {
  const controller = new UserController();
  const { body } = req;

  if ("password" in body) {
    return res
      .status(405)
      .send({ message: "Not allowed to update the password" });
  }

  const response = await controller.updateUser(req.params.id, body);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.send(response);
});

router.delete("/:id", auth, async (req, res) => {
  const controller = new UserController();
  const response = await controller.deleteUser(req.params.id);
  if (!response) res.status(404).send({ message: "No user found" });
  return res.send(response);
});

export default router;
