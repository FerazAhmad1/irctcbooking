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
const traindb_1 = __importDefault(require("../model/traindb"));
exports.search_train = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validate = req.body;
        const user = req.body.__user;
        const response = yield traindb_1.default.search_train(validate, user);
        if (!response || response.error) {
            throw {
                message: ((_a = response) === null || _a === void 0 ? void 0 : _a.message) || "your model function is not working"
            };
        }
        res.status(200).json(response);
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            error: false,
            message: err.message || "UNEXPECTED ERROR",
            data: {}
        });
    }
});
//# sourceMappingURL=train.js.map