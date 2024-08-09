"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbreservetickets_1 = __importDefault(require("../model/dbreservetickets"));
exports.create_reserve_ticket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("fffffffffffffffffffffffffffffffffffffffffffffff");
    try {
        console.log("req.bodyRRRRRRRRRRRRRRRRRRRRRRRRRRR", req.body);
        const response = yield dbreservetickets_1.default.ticket_reservation(req.body, req.body.__user);
        if (!response || response.error) {
            throw {
                message: ((_a = response) === null || _a === void 0 ? void 0 : _a.message) || "your model function is not working"
            };
        }
        res.status(200).json(response);
    }
    catch (error) {
        const err = error;
        console.log(err);
        res.status(400).json({
            error: true,
            message: err.message || "UNEXPECTED ERROR",
            data: {},
        });
    }
});
exports.get_all_ticket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let { page } = req.body;
        page = page * 1;
        const user = req.body.__user;
        const response = yield dbreservetickets_1.default.get_all_ticket(user, page);
        if (!response || response.error) {
            throw {
                message: ((_b = response) === null || _b === void 0 ? void 0 : _b.message) || "your model function is not working"
            };
        }
        res.status(200).json(response);
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            error: true,
            message: err.message || "UNEXPECTED ERROR",
            data: {}
        });
    }
});
exports.cancel_ticket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const user = req.body.__user;
        const validate = req.body;
        const response = yield dbreservetickets_1.default.cancel_ticket(validate, user);
        if (!response || response.error) {
            throw {
                message: ((_c = response) === null || _c === void 0 ? void 0 : _c.message) || "your model function is not working"
            };
        }
        res.status(200).json(response);
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            error: true,
            message: err.message || "UNEXPECTED ERROR",
            data: {},
        });
    }
});
//# sourceMappingURL=reserve_ticket.js.map