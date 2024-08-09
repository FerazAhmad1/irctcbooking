"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const train_1 = require("../controller/train");
const helpfn_1 = require("../helper.ts/helpfn");
const helpfn_2 = require("../helper.ts/helpfn");
const schema_1 = require("../helper.ts/schema");
const router = express_1.default.Router();
router.post("/search", helpfn_1.protect, helpfn_2.validate_body(schema_1.search_train_schema), train_1.search_train);
exports.default = router;
//# sourceMappingURL=trains.js.map