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
const dbusers_1 = __importDefault(require("../model/dbusers"));
// export const signup = async (req: Request, res: Response) => {
//   try {
//     const validate = await applyValidation(signupSchema, req.body);
//     console.log("ffffffff", validate);
//     const { firstName, lastName, email, mobile, password } = req.body;
//     const signupBody = { firstName, lastName, email, mobile, password };
//     const hashedPasssword = await bcrypt.hash(password, 12);
//     signupBody.password = hashedPasssword;
//     const id = await user.insertUser(signupBody);
//     if (!id) {
//       throw { message: "this email already exist" };
//     }
//     console.log(id);
//     const token = signToken(id);
//     res.status(200).json({
//       error: false,
//       message: "signup successfull",
//       data: { token },
//     });
//   } catch (err) {
//     const error = err as any;
//     console.log(err);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.signup_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield dbusers_1.default.signup_otp(req.body);
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
            error: true,
            message: err.message || "UNEXPECTED ERROR",
            data: {},
        });
    }
});
exports.verify_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const response = yield dbusers_1.default.verifyotp(req.body);
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
            data: {},
        });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const response = yield dbusers_1.default.login(req.body);
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
exports.update_role = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const response = yield dbusers_1.default.update_role(req.body, req.user);
        if (!response || response.error) {
            throw {
                message: ((_d = response) === null || _d === void 0 ? void 0 : _d.message) || "your model function is not working"
            };
        }
        res.status(200).json(response);
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            error: true,
            message: err.message || "UNEXPECTED ERROR",
            data: {},
        });
    }
});
exports.forgot_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const host = req.get("host");
        const protocol = req.protocol;
        const response = yield dbusers_1.default.forgot_password(req.body, protocol, host);
        if (!response || response.error) {
            throw {
                message: ((_e = response) === null || _e === void 0 ? void 0 : _e.message) || "your model function is not working"
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
exports.reset_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const token = req.params.token;
        const password = req.body.password;
        const response = yield dbusers_1.default.reset_password(req.body, token, password);
        if (!response || response.error) {
            throw {
                message: ((_f = response) === null || _f === void 0 ? void 0 : _f.message) || "your model function is not working"
            };
        }
        res.status(200).json(response);
    }
    catch (error) {
        const err = error;
        res.status(err.errorCode || 401).json({
            error: true,
            message: err.message || "UNEXPECTED ERROR",
            data: {},
        });
    }
});
//# sourceMappingURL=users.js.map