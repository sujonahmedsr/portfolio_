import { Request, RequestHandler, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import status from "http-status"
import { participantService } from "./participant.service"

const createParticipant = catchAsync(async (req: Request & {user?: any}, res: Response) => {
    const { eventId } = req.params
    const { id: userId } = req.user
    const result = await participantService.createParticipant(eventId, userId)
    sendResponse(res, {
        statusCode: status.CREATED,
        message: "Participant Created Successfully",
        success: true,
        data: result
    })
})
const participants: RequestHandler = catchAsync(async (req, res) => {
    const { eventId } = req.params
    const result = await participantService.participants(eventId)
    sendResponse(res, {
        statusCode: status.OK,
        message: "Participant Fetched Successfully",
        success: true,
        data: result
    })
})

const ApproveParticipant = catchAsync(async (req: Request & {user?: any}, res: Response) => {
    const participantId = req.params.id;
    const user = req.user;
    const result = await participantService.ApproveParticipant(
      participantId,
      user,
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Participant approved successfully',
      data: result,
    });
  });
  
  const RejectParticipant = catchAsync(async (req: Request  & {user?: any}, res: Response) => {
    const participantId = req.params.id;
    const user = req.user;
    const result = await participantService.RejectParticipant(
      participantId,
      user,
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Participant rejected successfully',
      data: result,
    });
  });

export const participantController = {
    createParticipant,
    participants,
    ApproveParticipant,
    RejectParticipant
}