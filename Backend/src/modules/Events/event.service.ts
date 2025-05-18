import { Event, EventStatus, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import calculatePagination, { IPaginationOptions } from "../../utils/pagination";
import EventConstants from "./event.constant";

interface IGetEventsParams {
  search?: string;
}

// Create Event
const createEvent = async (payload: Event) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: payload.creator_id },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Creator not found.");
  }

  const event = await prisma.event.create({
    data: payload,
  });

  return event;
};

// Get All Events
const getAllEvents = async (filters: IGetEventsParams,
  options: IPaginationOptions,) => {
  const { page, limit, skip } = calculatePagination(options);
  const { search, ...restFilters } = filters;

  const andConditions: Prisma.EventWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: EventConstants.SearchableFields.map((field) => ({
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
        const value = (restFilters as Record<string, string>)[key];
        const processedValue =
          value === 'true' ? true : value === 'false' ? false : value;

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

  const whereConditions: Prisma.EventWhereInput = {
    AND: andConditions,
  };

  const data = await prisma.event.findMany({
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
    orderBy:
      options.sort_by && options.sort_order
        ? {
          [options.sort_by]: options.sort_order,
        }
        : {
          created_at: 'desc',
        },
  });

  const total = await prisma.event.count({
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
};

// Get Single Event
const getSingleEvent = async (id: string) => {
  const event = await prisma.event.findUnique({
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
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found.");
  }

  return event;
};

// Update Event
const updateEvent = async (id: string, data: Partial<Event>) => {
  const existingEvent = await prisma.event.findUnique({ where: { id } });

  if (!existingEvent || existingEvent.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found.");
  }

  if (existingEvent.status === EventStatus.CANCELLED || existingEvent.status === EventStatus.COMPLETED) {
    throw new ApiError(httpStatus.NOT_FOUND, "You Can not update this event now.");
  }

  const updatedEvent = await prisma.event.update({
    where: { id },
    data,
  });

  return updatedEvent;
};

// Soft Delete Event
const deleteEvent = async (id: string) => {
  const existingEvent = await prisma.event.findUnique({ where: { id, is_deleted: false } });

  if (!existingEvent || existingEvent.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found.");
  }

  await prisma.event.update({
    where: { id },
    data: { is_deleted: true },
  });

  return { message: "Event soft deleted successfully" };
};

// Export All Services
export const eventService = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
