"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const review_controller_1 = __importDefault(require("./review.controller"));
const Auth_1 = require("../../middlewares/Auth");
const router = express_1.default.Router();
router
    .route('/:id/reviews')
    .get((0, Auth_1.auth)(client_1.Role.USER), review_controller_1.default.GetReviews)
    .post((0, Auth_1.auth)(client_1.Role.USER), review_controller_1.default.SubmitReview);
router
    .route('/:id')
    .put((0, Auth_1.auth)(client_1.Role.USER), review_controller_1.default.UpdateReview)
    .delete((0, Auth_1.auth)(client_1.Role.USER), review_controller_1.default.DeleteReview);
exports.ReviewRoutes = router;
