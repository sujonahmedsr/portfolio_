import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { userService } from "./user.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.loginUser(req.body);
    res.cookie('REFRESH_TOKEN', result.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Login successful!",
        data: result,
    });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await userService.getSingleUser(id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User fetched successfully',
        data: result,
    });
});

export const userController = {
    loginUser,
    getUserById,
};
