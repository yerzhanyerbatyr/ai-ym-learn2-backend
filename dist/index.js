"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = __importDefault(require("./database/connect"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// app.use(cors());
(0, connect_1.default)().catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
});
app.get("/", (req, res) => {
    res.send("Welcome to the API");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
