"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get('/', user_controller_1.userController.getAllUsers);
router.get('/:id', user_controller_1.userController.getUserByEmail);
router.post('/', (0, validateRequest_1.default)(user_validation_1.userSchema), user_controller_1.userController.createUser);
exports.UserRoutes = router;
