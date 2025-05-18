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
exports.participantService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const client_1 = require("@prisma/client");
const createParticipant = (eventId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield prisma_1.default.event.findUnique({ where: { id: eventId, is_deleted: false } });
    if (!event)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Event not found.");
    const participant = yield prisma_1.default.participant.findUnique({
        where: { event_id_user_id: { event_id: eventId, user_id: userId } },
    });
    if (participant) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are already a participant');
    }
    if (event.status === client_1.EventStatus.COMPLETED) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Event is completed');
    }
    if (event.status === client_1.EventStatus.CANCELLED) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Event is cancelled');
    }
    let result;
    if (!event.is_private && !event.is_paid) {
        // instant acceptance
        result = yield prisma_1.default.participant.create({
            data: {
                event_id: eventId,
                user_id: userId,
                payment_status: client_1.PaymentStatus.FREE,
                approval_status: client_1.ApprovalStatus.APPROVED,
            },
        });
    }
    else if (event.is_private && event.is_paid) {
        // payment flow
        yield prisma_1.default.payment.create({
            data: {
                event_id: eventId,
                user_id: userId,
                amount: event.fee,
                transaction_id: 'PaymentUtils.generateTransactionId()',
            },
        });
        result = yield prisma_1.default.participant.create({
            data: {
                event_id: eventId,
                user_id: userId,
                payment_status: client_1.PaymentStatus.PENDING,
                approval_status: client_1.ApprovalStatus.PENDING,
            },
        });
    }
    else if (!event.is_private && event.is_paid) {
        // payment flow
        yield prisma_1.default.payment.create({
            data: {
                event_id: eventId,
                user_id: userId,
                amount: event.fee,
                transaction_id: "PaymentUtils.generateTransactionId()",
            },
        });
        result = yield prisma_1.default.participant.create({
            data: {
                event_id: eventId,
                user_id: userId,
                payment_status: client_1.PaymentStatus.PENDING,
                approval_status: client_1.ApprovalStatus.PENDING,
            },
        });
    }
    else if (event.is_private && !event.is_paid) {
        // pending approval
        result = yield prisma_1.default.participant.create({
            data: {
                event_id: eventId,
                user_id: userId,
                payment_status: client_1.PaymentStatus.FREE,
                approval_status: client_1.ApprovalStatus.PENDING,
            },
        });
    }
    return result;
});
const participants = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.event.findMany({
        where: {
            id: eventId
        },
        include: {
            Participant: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });
    return result;
});
const ApproveParticipant = (participantId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const participant = yield prisma_1.default.participant.findUnique({
        where: { id: participantId },
    });
    if (!participant) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Participant not found');
    }
    if (participant.approval_status !== client_1.ApprovalStatus.PENDING) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Participant is not pending');
    }
    if (user.role !== client_1.Role.ADMIN && participant.user_id !== user.id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to approve this participant');
    }
    const result = yield prisma_1.default.participant.update({
        where: { id: participantId },
        data: {
            approval_status: client_1.ApprovalStatus.APPROVED,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Participant not found');
    }
    return result;
});
const RejectParticipant = (participantId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const participant = yield prisma_1.default.participant.findUnique({
        where: { id: participantId },
    });
    if (!participant) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Participant not found');
    }
    if (user.role !== client_1.Role.ADMIN && participant.user_id !== user.id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to reject this participant');
    }
    const result = yield prisma_1.default.participant.update({
        where: { id: participantId },
        data: { approval_status: client_1.ApprovalStatus.REJECTED },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Participant not found');
    }
    return result;
});
exports.participantService = {
    createParticipant,
    participants,
    ApproveParticipant,
    RejectParticipant
};
