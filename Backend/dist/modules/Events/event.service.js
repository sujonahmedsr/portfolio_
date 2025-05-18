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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const event_constant_1 = __importDefault(require("./event.constant"));
// Create Event
const createEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: payload.creator_id },
    });
    if (!existingUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Creator not found.");
    }
    const event = yield prisma_1.default.event.create({
        data: payload,
    });
    return event;
});
// Get All Events
const getAllEvents = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = (0, pagination_1.default)(options);
    const { search } = filters, restFilters = __rest(filters, ["search"]);
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: event_constant_1.default.SearchableFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(restFilters).length > 0) {
        andConditions.push({
            AND: Object.keys(restFilters).map((key) => {
                const value = restFilters[key];
                const processedValue = value === 'true' ? true : value === 'false' ? false : value;
                return {
                    [key]: {
                        equals: processedValue,
                    },
                };
            }),
        });
    }
    andConditions.push({
        is_deleted: false,
    });
    const whereConditions = {
        AND: andConditions,
    };
    const data = yield prisma_1.default.event.findMany({
        where: whereConditions,
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        skip,
        take: limit,
        orderBy: options.sort_by && options.sort_order
            ? {
                [options.sort_by]: options.sort_order,
            }
            : {
                created_at: 'desc',
            },
    });
    const total = yield prisma_1.default.event.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data,
    };
});
// Get Single Event
const getSingleEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield prisma_1.default.event.findUnique({
        where: { id, is_deleted: false },
        include: {
            creator: true,
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
            },
            review: {
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
    if (!event || event.is_deleted) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Event not found.");
    }
    return event;
});
// Update Event
const updateEvent = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEvent = yield prisma_1.default.event.findUnique({ where: { id } });
    if (!existingEvent || existingEvent.is_deleted) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Event not found.");
    }
    if (existingEvent.status === client_1.EventStatus.CANCELLED || existingEvent.status === client_1.EventStatus.COMPLETED) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "You Can not update this event now.");
    }
    const updatedEvent = yield prisma_1.default.event.update({
        where: { id },
        data,
    });
    return updatedEvent;
});
// Soft Delete Event
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEvent = yield prisma_1.default.event.findUnique({ where: { id, is_deleted: false } });
    if (!existingEvent || existingEvent.is_deleted) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Event not found.");
    }
    yield prisma_1.default.event.update({
        where: { id },
        data: { is_deleted: true },
    });
    return { message: "Event soft deleted successfully" };
});
// Export All Services
exports.eventService = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent,
};
