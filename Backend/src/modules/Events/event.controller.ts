import { RequestHandler } from "express"
import catchAsync from "../../utils/catchAsync"
import { eventService } from "./event.service"
import sendResponse from "../../utils/sendResponse"
import status from "http-status"
import EventConstants from "./event.constant"
import pick from "../../utils/pick"

const createEvent: RequestHandler = catchAsync(async (req, res) => {
    const result = await eventService.createEvent(req.body)
    sendResponse(res, {
        statusCode: status.CREATED,
        message: "Event Created Successfully",
        success: true,
        data: result
    })
})
const getAllEvents: RequestHandler = catchAsync(async (req, res) => {
    const filters = pick(req.query, EventConstants.FilterableFields);

    const options = pick(req.query, ['limit', 'page', 'sort_by', 'sort_order']);
    const result = await eventService.getAllEvents(filters, options)
    sendResponse(res, {
        statusCode: status.OK,
        message: "Events Fetched Successfully",
        success: true,
        data: result.data,
        meta: result.meta,
    })
})
const getSingleEvent: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await eventService.getSingleEvent(id)
    sendResponse(res, {
        statusCode: status.OK,
        message: "Event Fetched Successfully",
        success: true,
        data: result
    })
})
const updateEvent: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await eventService.updateEvent(id, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        message: "Event Updated Successfully",
        success: true,
        data: result
    })
})
const deleteEvent: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params
    await eventService.deleteEvent(id)
    sendResponse(res, {
        statusCode: status.OK,
        message: "Event Deleted",
        success: true,
        data: null
    })
})

export const eventController = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent
}