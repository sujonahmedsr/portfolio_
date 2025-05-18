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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelpers_1 = require("../../middlewares/jwtHelpers");
const config_1 = __importDefault(require("../../config"));
const Login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({ where: { email: payload.email } });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No user found with this email');
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    const jwtPayload = { id: user.id, email: user.email, role: user.role };
    const access_token = (0, jwtHelpers_1.generateToken)(jwtPayload, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refresh_token = (0, jwtHelpers_1.generateToken)(jwtPayload, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return { access_token, refresh_token };
});
const ChangePassword = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserValid = yield prisma_1.default.user.findFirst({
        where: { id: user.id },
    });
    if (!isUserValid) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No user found');
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.old_password, isUserValid.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid password');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.new_password, Number(12));
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });
});
const GetMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield prisma_1.default.user.findUnique({
        where: { id: user.id, email: user.email },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            created_at: true,
        },
    });
    if (!userProfile) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return userProfile;
});
exports.AuthService = {
    Login,
    ChangePassword,
    GetMyProfile
};
