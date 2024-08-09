"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controller/users");
const helpfn_1 = require("../helper.ts/helpfn");
const schema_1 = require("../helper.ts/schema");
const helpfn_2 = require("../helper.ts/helpfn");
const router = express_1.default.Router();
console.log("I am auth router running");
router.post("/signup", helpfn_1.validate_body(schema_1.forgot_password_schema), users_1.signup_otp);
router.post("/verifyotp", helpfn_1.validate_body(schema_1.signupSchema), users_1.verify_otp);
router.post("/login", helpfn_1.validate_body(schema_1.login_schema), users_1.login);
router.post("/approoverole", helpfn_2.protect, helpfn_2.restrict_to("user"), users_1.update_role);
router.post("/forgotpassword", helpfn_1.validate_body(schema_1.forgot_password_schema), users_1.forgot_password);
router.post("/resetpassword/:token", helpfn_1.validate_body(schema_1.reset_password_schema), users_1.reset_password);
exports.default = router;
//# sourceMappingURL=auth.js.map