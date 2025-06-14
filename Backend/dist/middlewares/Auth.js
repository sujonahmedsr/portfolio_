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
exports.auth = void 0;
const config_1 = __importDefault(require("../config"));
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const jwtHelpers_1 = require("./jwtHelpers");
const prisma = new client_1.PrismaClient;
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access");
            }
            const decoded = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt.jwt_secret);
            const { id, email, role } = decoded;
            const user = yield prisma.user.findUnique({
                where: { id, email },
            });
            if (!user) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access");
            }
            if (roles.length && !roles.includes(role)) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorizeds.");
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.auth = auth;
