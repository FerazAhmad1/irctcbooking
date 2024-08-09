"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reserve_ticket_1 = require("../controller/reserve_ticket");
const helpfn_1 = require("../helper.ts/helpfn");
const helpfn_2 = require("../helper.ts/helpfn");
const schema_1 = require("../helper.ts/schema");
const router = express_1.default.Router();
router.post("/all_tickets", helpfn_1.protect, helpfn_2.validate_body(schema_1.get_all_ticket_schema), reserve_ticket_1.get_all_ticket);
router
    .route("/")
    .post(helpfn_1.protect, helpfn_2.validate_body(schema_1.reserve_ticket_schema), reserve_ticket_1.create_reserve_ticket);
router.post("/cancelticket", helpfn_1.protect, reserve_ticket_1.cancel_ticket);
exports.default = router;
//# sourceMappingURL=reserve_ticket.js.map