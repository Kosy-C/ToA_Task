"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const admin_1 = __importDefault(require("./routes/admin"));
const users_1 = __importDefault(require("./routes/users"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
//this calls the database connection
(0, config_1.connectDB)();
app.use('/admins', admin_1.default);
app.use('/user', users_1.default);
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
