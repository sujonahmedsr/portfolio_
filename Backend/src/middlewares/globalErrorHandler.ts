import { Request, Response, NextFunction } from "express";
import status from "http-status";
import { ZodError } from "zod";
import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";
import ApiError from "../errors/ApiError";

const globalErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorDetails: any = [];

    // ✅ Zod Validation Error
    if (error instanceof ZodError) {
        statusCode = status.BAD_REQUEST;
        message = "Validation Error";
        errorDetails = error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
        }));
    }

    // ✅ Prisma Known Errors (Optional)
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = status.BAD_REQUEST;
        message = "Database Error";
        errorDetails = [
            {
                code: error.code,
                message: error.message,
            },
        ];
    }

    // ✅ Custom API Error
    else if (error instanceof ApiError) {
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

export default globalErrorHandler;