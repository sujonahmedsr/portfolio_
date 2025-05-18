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
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const SubmitReview = (eventId, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if event exists and is completed
    const event = yield prisma_1.default.event.findUnique({
        where: { id: eventId, is_deleted: false },
    });
    if (!event) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Event not found');
    }
    if (event.status !== client_1.EventStatus.COMPLETED) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You can only review completed events');
    }
    // Check if user participated in the event
    const participant = yield prisma_1.default.participant.findUnique({
        where: {
            event_id_user_id: {
                event_id: eventId,
                user_id: user.id,
            },
        },
    });
    if (!participant) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You must be a participant to review this event');
    }
    // Check if user already reviewed this event
    const existingReview = yield prisma_1.default.review.findUnique({
        where: {
            user_id_event_id: {
                user_id: user.id,
                event_id: eventId,
            },
        },
    });
    if (existingReview) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You have already reviewed this event');
    }
    // Create review
    const result = yield prisma_1.default.review.create({
        data: {
            user_id: user.id,
            event_id: eventId,
            rating: payload.rating,
            comment: payload.comment,
        },
    });
    return result;
});
const GetReviews = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if event exists
    const event = yield prisma_1.default.event.findUnique({
        where: { id: eventId, is_deleted: false },
    });
    if (!event) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Event not found');
    }
    // Get all reviews for the event
    const reviews = yield prisma_1.default.review.findMany({
        where: { event_id: eventId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { created_at: 'desc' },
    });
    return reviews;
});
const UpdateReview = (reviewId, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if review exists
    const review = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
        include: {
            event: true,
        },
    });
    if (!review) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    // Check if user is the review owner
    if (review.user_id !== user.id && user.role !== client_1.Role.ADMIN) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to update this review');
    }
    // Check review window (within 7 days of event completion)
    if (review.event.status === client_1.EventStatus.COMPLETED) {
        const eventDate = new Date(review.event.date_time);
        const currentDate = new Date();
        const daysDifference = (currentDate.getTime() - eventDate.getTime()) / (1000 * 3600 * 24);
        if (daysDifference > 7 && user.role !== client_1.Role.ADMIN) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Review can only be updated within 7 days of event completion');
        }
    }
    // Update review
    const result = yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: {
            rating: payload.rating,
            comment: payload.comment,
        },
    });
    return result;
});
const DeleteReview = (reviewId, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if review exists
    const review = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    // Check if user is the review owner or admin
    if (review.user_id !== user.id && user.role !== client_1.Role.ADMIN) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to delete this review');
    }
    // Delete review
    yield prisma_1.default.review.delete({
        where: { id: reviewId },
    });
});
const ReviewService = {
    SubmitReview,
    GetReviews,
    UpdateReview,
    DeleteReview,
};
exports.default = ReviewService;
