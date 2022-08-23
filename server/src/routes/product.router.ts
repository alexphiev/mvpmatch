import express from "express";
import {
  auth,
  authSeller,
  authSellerPost,
} from "../middlewares/authJWT.middleware";
import ProductController from "../controllers/product.controller";

const router = express.Router();

router.get("/", async (_req, res) => {
  const controller = new ProductController();
  const response = await controller.getProducts();
  return res.send(response);
});

router.post("/", auth, authSellerPost, async (req, res) => {
  const controller = new ProductController();
  const response = await controller.createProduct(req.body);
  try {
    return res.send(response);
  } catch {
    return res.send(response);
  }
});

router.get("/:id", auth, async (req, res) => {
  const controller = new ProductController();
  const response = await controller.getProduct(req.params.id);
  if (!response) res.status(404).send({ message: "No product found" });
  return res.send(response);
});

router.patch("/:id", auth, authSeller, async (req, res) => {
  const controller = new ProductController();
  const { body } = req;

  const response = await controller.updateProduct(req.params.id, body);
  if (!response) return res.status(404).send({ message: "No product found" });
  try {
    return res.send(response);
  } catch {}
});

router.delete("/:id", auth, authSeller, async (req, res) => {
  const controller = new ProductController();
  const response = await controller.deleteProduct(req.params.id);
  if (!response) res.status(404).send({ message: "No product found" });
  try {
    return res.send(response);
  } catch {}
});

export default router;
