import express from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", async (req, res) => {
  const controller = new AuthController();
  const response = await controller.login(req.body);
  if ("error" in response) {
    return res.status(404).send(response);
  }
  return res.send(response);
});

export default router;
