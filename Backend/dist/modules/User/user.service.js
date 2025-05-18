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
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../../middlewares/jwtHelpers");
const config_1 = __importDefault(require("../../config"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            is_deleted: true,
            created_at: true,
            updated_at: true
        }
    });
    return users;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        include: {
            event: true,
            received_invitations: true,
            sent_invitations: true
        }
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    return user;
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prisma_1.default.user.findFirst({
        where: { email: payload.email },
    });
    if (isUserExists) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'User already exists');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(12));
    const user = yield prisma_1.default.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            role: client_1.Role.USER,
        },
    });
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const access_token = (0, jwtHelpers_1.generateToken)(jwtPayload, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refresh_token = (0, jwtHelpers_1.generateToken)(jwtPayload, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return { access_token, refresh_token };
});
exports.userService = {
    createUser,
    getSingleUser,
    getAllUsers
};
