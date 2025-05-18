import httpStatus from 'http-status';
import prisma from '../../utils/prisma';
import { EventStatus, Review, Role } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';

const SubmitReview = async (
    eventId: string,
    payload: Review,
    user: JwtPayload,
  ) => {
    // Check if event exists and is completed
    const event = await prisma.event.findUnique({
      where: { id: eventId, is_deleted: false },
    });
  
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
  
    if (event.status !== EventStatus.COMPLETED) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You can only review completed events',
      );
    }
  
    // Check if user participated in the event
    const participant = await prisma.participant.findUnique({
      where: {
        event_id_user_id: {
          event_id: eventId,
          user_id: user.id,
        },
      },
    });
  
    if (!participant) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You must be a participant to review this event',
      );
    }
  
    // Check if user already reviewed this event
    const existingReview = await prisma.review.findUnique({
      where: {
        user_id_event_id: {
          user_id: user.id,
          event_id: eventId,
        },
      },
    });
  
    if (existingReview) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You have already reviewed this event',
      );
    }
  
    // Create review
    const result = await prisma.review.create({
      data: {
        user_id: user.id,
        event_id: eventId,
        rating: payload.rating,
        comment: payload.comment,
      },
    });
  
    return result;
  };
  
  const GetReviews = async (eventId: string) => {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId, is_deleted: false },
    });
  
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
  
    // Get all reviews for the event
    const reviews = await prisma.review.findMany({
      where: { event_id: eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  
    return reviews;
  };

const UpdateReview = async (
  reviewId: string,
  payload: Partial<Review>,
  user: JwtPayload,
) => {
  // Check if review exists
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      event: true,
    },
  });

  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Check if user is the review owner
  if (review.user_id !== user.id && user.role !== Role.ADMIN) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You do not have permission to update this review',
    );
  }

  // Check review window (within 7 days of event completion)
  if (review.event.status === EventStatus.COMPLETED) {
    const eventDate = new Date(review.event.date_time);
    const currentDate = new Date();
    const daysDifference =
      (currentDate.getTime() - eventDate.getTime()) / (1000 * 3600 * 24);

    if (daysDifference > 7 && user.role !== Role.ADMIN) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Review can only be updated within 7 days of event completion',
      );
    }
  }

  // Update review
  const result = await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  return result;
};

const DeleteReview = async (reviewId: string, user: JwtPayload) => {
  // Check if review exists
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Check if user is the review owner or admin
  if (review.user_id !== user.id && user.role !== Role.ADMIN) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You do not have permission to delete this review',
    );
  }

  // Delete review
  await prisma.review.delete({
    where: { id: reviewId },
  });
};

const ReviewService = {
  SubmitReview,
  GetReviews,
  UpdateReview,
  DeleteReview,
};

export default ReviewService;