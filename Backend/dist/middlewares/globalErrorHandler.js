"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorDetails = [];
    // ✅ Zod Validation Error
    if (error instanceof zod_1.ZodError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Validation Error";
        errorDetails = error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
        }));
    }
    // ✅ Prisma Known Errors (Optional)
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Database Error";
        errorDetails = [
            {
                code: error.code,
                message: error.message,
            },
        ];
    }
    // ✅ Custom API Error
    else if (error instanceof ApiError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
        errorDetails = error;
    }
    // ✅ Custom Error with Message
    else if (error instanceof Error) {
        message = error.message;
        errorDetails = [{ message: error.message }];
    }
    // ✅ Send Response
    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });
};
exports.default = globalErrorHandler;
