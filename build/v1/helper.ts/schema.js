"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const moment_1 = __importDefault(require("moment"));
// const moment = require('moment');
// Define a custom date format validation schema using Joi's custom method
const person_schema = joi_1.default.object({
    firstname: joi_1.default
        .string()
        .trim()
        .min(3)
        .max(255)
        .pattern(/^[A-Za-z]+$/)
        .required(),
    lastname: joi_1.default
        .string()
        .trim()
        .min(3)
        .max(255)
        .pattern(/^[A-Za-z]+$/)
        .required(),
    dob: joi_1.default.date().iso().required(),
}).unknown(true);
const customDateFormat = joi_1.default
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .custom((value, helpers) => {
    const date = moment_1.default(value, "YYYY-MM-DD", true);
    if (!date.isValid()) {
        return helpers.error("any.invalid");
    }
    const now = moment_1.default();
    const maxDate = moment_1.default().add(4, "months");
    if (date.isBefore(now, "day")) {
        return helpers.error("date.min", { limit: now.format("YYYY-MM-DD") });
    }
    if (date.isAfter(maxDate, "day")) {
        return helpers.error("date.max", { limit: maxDate.format("YYYY-MM-DD") });
    }
    return value;
})
    .messages({
    "string.pattern.base": `"date" must be in the format YYYY-MM-DD`,
    "date.min": `"date" cannot be in the past. Minimum allowed date is today`,
    "date.max": `"date" cannot be more than four months in the future.`,
    "any.invalid": `"date" must be a valid date in the format YYYY-MM-DD`,
});
exports.signupSchema = joi_1.default.object({
    firstName: joi_1.default
        .string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .min(3)
        .max(255)
        .required(),
    lastName: joi_1.default
        .string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .min(3)
        .max(255)
        .required(),
    mobile: joi_1.default
        .string()
        .trim()
        .pattern(/^[1-9]\d*$/)
        .length(10)
        .required(),
    email: joi_1.default.string().trim().email().required(),
    otp: joi_1.default
        .string()
        .trim()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
    role: joi_1.default.string().trim().valid("user").required(),
    password: joi_1.default.string().trim().min(8).required(),
    dob: joi_1.default.date().iso().required()
}).unknown(true);
exports.login_schema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required(),
    password: joi_1.default.string().min(8).max(255).required(),
}).unknown(true);
exports.reserve_ticket_schema = joi_1.default.object({
    from_id: joi_1.default.string().max(255).required(),
    to_id: joi_1.default.string().max(255).required(),
    startdate: customDateFormat.required(),
    trainnumber: joi_1.default
        .string()
        .pattern(/^[1-9]\d*$/)
        .length(5)
        .required(),
    mobile: joi_1.default
        .string()
        .pattern(/^[1-9]\d*$/)
        .length(10)
        .required(),
    familymobile: joi_1.default
        .string()
        .pattern(/^[1-9]\d*$/)
        .length(10)
        .required(),
    customers: joi_1.default.array().items(person_schema).min(1).max(4).required(),
    email: joi_1.default.string().email().required(),
    district: joi_1.default.string().min(3).max(255),
    country: joi_1.default.string().min(3).max(255),
    pincode: joi_1.default
        .string()
        .pattern(/^[1-9]\d*$/)
        .length(6)
        .required(),
    state: joi_1.default.string().min(3).max(255).required(),
}).unknown(true);
exports.search_train_schema = joi_1.default.object({
    from: joi_1.default.string().min(2).max(255).required(),
    to: joi_1.default.string().min(2).max(255).required(),
    date_of_journey: customDateFormat.required(),
}).unknown(true);
exports.forgot_password_schema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required(),
}).unknown(true);
exports.reset_password_schema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required(),
    password: joi_1.default.string().trim().min(8).max(255).required(),
}).unknown(true);
exports.general_ticket_schema = joi_1.default.object({
    from: joi_1.default.string().min(2).max(255).required(),
    to: joi_1.default.string().min(2).max(255).required(),
    train_type: joi_1.default.string().valid("SF", "EX").required(),
    quantity: joi_1.default.number().min(1).max(4).required(),
}).unknown(true);
exports.cancel_ticket_schema = joi_1.default.object({
    pnr: joi_1.default.string().length(10).required(),
}).unknown(true);
exports.search_station_schema = joi_1.default.object({
    station_name_or_code: joi_1.default.string().min(2).max(255).required(),
    page: joi_1.default.string().pattern(/^[1-9]\d*$/).default("1").required()
}).unknown(true);
exports.get_all_ticket_schema = joi_1.default.object({
    page: joi_1.default.string().pattern(/^[1-9]\d*$/).default("1").required()
}).unknown(true);
//# sourceMappingURL=schema.js.map