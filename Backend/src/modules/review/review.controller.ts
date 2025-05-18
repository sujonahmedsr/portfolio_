import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import ReviewService from './review.services';
import { Request } from 'express';

const SubmitReview = catchAsync(async (req: Request & { user?: any }, res) => {
    const eventId = req.params.id;
    const reviewData = req.body;
    const user = req.user;

    const result = await ReviewService.SubmitReview(eventId, reviewData, user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review submitted successfully',
        data: result,
    });
});

const GetReviews = catchAsync(async (req, res) => {
    const eventId = req.params.id;

    const result = await ReviewService.GetReviews(eventId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        data: result,
    });
});

const UpdateReview = catchAsync(async (req: Request & { user?: any }, res) => {
    const reviewId = req.params.id;
    const updateData = req.body;
    const user = req.user;

    const result = await ReviewService.UpdateReview(reviewId, updateData, user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review updated successfully',
        data: result,
    });
});

const DeleteReview = catchAsync(async (req: Request & { user?: any }, res) => {
    const reviewId = req.params.id;
    const user = req.user;

    await ReviewService.DeleteReview(reviewId, user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review deleted successfully',
    });
});

const ReviewController = {
    GetReviews,
    SubmitReview,
    UpdateReview,
    DeleteReview,
};

export default ReviewController;