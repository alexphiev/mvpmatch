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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const user_1 = require("../models/user");
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = database_1.dataSource.getRepository(user_1.User);
    return userRepository.find();
});
exports.getUsers = getUsers;
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = database_1.dataSource.getRepository(user_1.User);
    const user = yield userRepository.findOne({ where: { id } });
    if (!user)
        return null;
    return user;
});
exports.getUser = getUser;
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = database_1.dataSource.getRepository(user_1.User);
    const user = new user_1.User();
    // generate salt to hash password
    const salt = yield bcrypt_1.default.genSalt(10);
    // now we set user password to hashed password
    const hashed = yield bcrypt_1.default.hash(payload.password, salt);
    return userRepository.save(Object.assign(Object.assign(Object.assign({}, user), payload), { password: hashed }));
});
exports.createUser = createUser;
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = database_1.dataSource.getRepository(user_1.User);
    const user = yield userRepository.findOne({ where: { id } });
    if (!user) {
        return null;
    }
    userRepository.merge(user, payload);
    return yield userRepository.save(user);
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = database_1.dataSource.getRepository(user_1.User);
    return yield userRepository.delete(id);
});
exports.deleteUser = deleteUser;
