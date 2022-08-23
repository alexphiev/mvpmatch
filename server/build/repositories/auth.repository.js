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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = payload;
    const userRepository = database_1.dataSource.getRepository(user_1.User);
    const user = yield userRepository.findOne({ where: { username } });
    if (!user)
        return {
            error: "User not found"
        };
    //Comparing passwords
    const passwordIsValid = bcrypt_1.default.compareSync(password, user.password);
    // checking if password was valid and send response accordingly
    if (!passwordIsValid) {
        return {
            error: "Invalid password",
        };
    }
    //Signing token with user id
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
    }, process.env.API_KEY || "", {
        expiresIn: 86400,
    });
    return {
        token,
        id: user.id,
        role: user.role,
        deposit: user.deposit,
        message: "Login successfull",
    };
});
exports.login = login;
