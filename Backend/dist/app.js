"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
// middlewares 
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'https://bong-events-a9.vercel.app',
        'https://event-mangement-zeta.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept',
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send({
        Message: "Event Management server..",
    });
});
// all routes 
app.use("/api", router_1.default);
// Global Error Handler 
app.use(globalErrorHandler_1.default);
// Api not found 
app.use(notFound_1.default);
exports.default = app;
