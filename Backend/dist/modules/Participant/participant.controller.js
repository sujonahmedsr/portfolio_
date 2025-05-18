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
exports.participantController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const participant_service_1 = require("./participant.service");
const createParticipant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const { id: userId } = req.user;
    const result = yield participant_service_1.participantService.createParticipant(eventId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: "Participant Created Successfully",
        success: true,
        data: result
    });
}));
const participants = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const result = yield participant_service_1.participantService.participants(eventId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Participant Fetched Successfully",
        success: true,
        data: result
    });
}));
const ApproveParticipant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const participantId = req.params.id;
    const user = req.user;
    const result = yield participant_service_1.participantService.ApproveParticipant(participantId, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Participant approved successfully',
        data: result,
    });
}));
const RejectParticipant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const participantId = req.params.id;
    const user = req.user;
    const result = yield participant_service_1.participantService.RejectParticipant(participantId, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Participant rejected successfully',
        data: result,
    });
}));
exports.participantController = {
    createParticipant,
    participants,
    ApproveParticipant,
    RejectParticipant
};
