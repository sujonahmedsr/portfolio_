import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.services";
import { Request, RequestHandler } from "express";

const Login: RequestHandler = catchAsync(async (req, res) => {
    const result = await AuthService.Login(req.body);
    const { access_token, refresh_token } = result;
    res.cookie('REFRESH_TOKEN', refresh_token,
        { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    sendResponse(res,
        {
            success: true,
            statusCode: status.OK,
            message: 'Login successful',
            data: { access_token }
        });
});

const ChangePassword = catchAsync(async (req: Request & {user?: any}, res) => {
  await AuthService.ChangePassword(req.body, req.user);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Password changed successfully',
  });
});

const GetMyProfile = catchAsync(async (req: Request & {user?: any}, res) => {
  const result = await AuthService.GetMyProfile(req.user);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

export const AuthController = {
    Login,
    ChangePassword,
    GetMyProfile
}