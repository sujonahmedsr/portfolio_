"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilterableFields = [
    'search',
    'is_private',
    'is_paid',
    'type',
    'status'
];
const SearchableFields = ['title', 'description', 'location'];
const EventConstants = {
    FilterableFields,
    SearchableFields,
};
exports.default = EventConstants;
