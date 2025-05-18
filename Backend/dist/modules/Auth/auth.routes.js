"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const Auth_1 = require("../../middlewares/Auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.LoginSchema), auth_controller_1.AuthController.Login);
router.patch('/change-password', (0, Auth_1.auth)(client_1.Role.ADMIN, client_1.Role.USER), (0, validateRequest_1.default)(auth_validation_1.ChangePasswordSchema), auth_controller_1.AuthController.ChangePassword);
router.get('/me', (0, Auth_1.auth)(client_1.Role.ADMIN, client_1.Role.USER), auth_controller_1.AuthController.GetMyProfile);
exports.AuthRoutes = router;
