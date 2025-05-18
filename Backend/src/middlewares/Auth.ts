import { NextFunction, Request, Response } from "express"
import config from "../config"
import { PrismaClient } from "@prisma/client"
import statusCode from "http-status";
import ApiError from "../errors/ApiError";
import { verifyToken } from "./jwtHelpers";

const prisma = new PrismaClient

export const auth = (...roles: string[]) => {
    return async (req: Request & {user?: any}, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                throw new ApiError(statusCode.UNAUTHORIZED, "Unauthorized Access")
            }

            const decoded = verifyToken(token, config.jwt.jwt_secret as string)

            const { id, email, role } = decoded;
    
            const user = await prisma.user.findUnique({
                where: { id, email },
            });

            if (!user) {
                throw new ApiError(statusCode.UNAUTHORIZED, "Unauthorized Access")
            }

            if (roles.length && !roles.includes(role)) {
                throw new ApiError(statusCode.UNAUTHORIZED, "You are not authorizeds.")
            }

            req.user = decoded

            next()
        } catch (error) {
            next(error)
        }
    }
}