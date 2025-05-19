import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { experienceService } from "./experience.service";

const createExperience = catchAsync(async (req: Request & {user?: any}, res: Response) => {
  const result = await experienceService.createExperience(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Experience created successfully",
    data: result,
  });
});

const getAllExperiences = catchAsync(async (_req: Request, res: Response) => {
  const result = await experienceService.getAllExperiences();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Experiences fetched successfully",
    data: result,
  });
});

const getSingleExperience = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await experienceService.getSingleExperience(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Experience fetched successfully",
    data: result,
  });
});

const updateExperience = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await experienceService.updateExperience(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Experience updated successfully",
    data: result,
  });
});

const deleteExperience = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await experienceService.deleteExperience(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Experience deleted successfully",
    data: result,
  });
});

export const experienceController = {
  createExperience,
  getAllExperiences,
  getSingleExperience,
  updateExperience,
  deleteExperience,
};
