"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const payment_controller_1 = __importDefault(require("./payment.controller"));
const Auth_1 = require("../../middlewares/Auth");
const router = express_1.default.Router();
router.post('/intent/:participant_id', (0, Auth_1.auth)(client_1.Role.USER), payment_controller_1.default.CreatePaymentIntent);
router.post('/ipn_listener', payment_controller_1.default.VerifyPayment);
exports.PaymentRoutes = router;
