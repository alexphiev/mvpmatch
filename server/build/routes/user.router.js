"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const authJWT_middleware_1 = require("../middlewares/authJWT.middleware");
const router = express_1.default.Router();
router.get("/", authJWT_middleware_1.auth, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_controller_1.default();
    const response = yield controller.getUsers();
    return res.send(response);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_controller_1.default();
    try {
        const response = yield controller.createUser(req.body);
        return res.send(response);
    }
    catch (error) {
        console.log(JSON.stringify(error, null, 2));
        switch (error.constructor) {
            case typeorm_1.QueryFailedError:
                return res.status(400).send({ error: error.driverError.detail });
            default:
                return res.status(400).send({ error: error.message });
        }
    }
}));
router.get("/:id", authJWT_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_controller_1.default();
    const response = yield controller.getUser(req.params.id);
    if (!response)
        res.status(404).send({ message: "No user found" });
    return res.send(response);
}));
router.patch("/:id", authJWT_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_controller_1.default();
    const { body } = req;
    if ("password" in body) {
        return res
            .status(405)
            .send({ message: "Not allowed to update the password" });
    }
    const response = yield controller.updateUser(req.params.id, body);
    if (!response)
        return res.status(404).send({ message: "No user found" });
    return res.send(response);
}));
router.delete("/:id", authJWT_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new user_controller_1.default();
    const response = yield controller.deleteUser(req.params.id);
    if (!response)
        res.status(404).send({ message: "No user found" });
    return res.send(response);
}));
exports.default = router;
