"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = require("./config/database");
const routes_1 = __importDefault(require("./routes"));
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
console.log("ENV");
console.log(process.env);
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Adding Helmet to enhance your API's security
app.use((0, helmet_1.default)());
// Enabling CORS for all requests
app.use((0, cors_1.default)());
// Logging of every http request
app.use((0, morgan_1.default)("dev"));
// Static files in public folder
app.use(express_1.default.static("public"));
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, {
    swaggerOptions: {
        url: "/swagger.json",
    },
}));
app.use(routes_1.default);
database_1.dataSource.initialize();
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
