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
const appdb_1 = require("./appdb");
const dbstation_1 = __importDefault(require("./dbstation"));
const helpfn_1 = require("../helper.ts/helpfn");
class general_ticket extends appdb_1.appdb {
    constructor() {
        super();
        this.table = "general_ticket";
        this.uniqueField = "id";
    }
    insert_general_ticket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.insertRecord(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    get_general_ticket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uniquefield, uniquefieldname, field } = data;
            this.where = `WHERE '${uniquefieldname}'='${uniquefield}'`;
            return this.select(this.table, field, this.where, '', '20');
        });
    }
    create_general_ticket(req_body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validate = req_body;
                const source_station_query = dbstation_1.default.search_station({ station_name_or_code: validate.from }, "*", 1);
                const destination_station_query = dbstation_1.default.search_station({ station_name_or_code: validate.to }, "*", 1);
                const [[from_station], [to_staion]] = yield Promise.all([source_station_query, source_station_query, destination_station_query]);
                if (!from_station) {
                    throw { message: "no source station found " };
                }
                if (!to_staion) {
                    throw {
                        message: "no destination station found",
                    };
                }
                const p1 = {
                    latitude: from_station.latitude,
                    longitude: from_station.longitude,
                };
                const p2 = { latitude: to_staion.latitude, longitude: to_staion.longitude };
                const distance = helpfn_1.calculate_distance(p1, p2);
                console.log(distance / 1000);
                const amount = helpfn_1.calculate_general_amount(validate.train_type, distance, validate.quantity);
                const right_now = helpfn_1.formatDateString(new Date(), "YYYY-MM-DD HH:mm:ss");
                const response = yield this.insert_general_ticket({
                    amount,
                    agentid: user.id,
                    source_stn: from_station.id * 1,
                    destination_stn: to_staion.id * 1,
                    time: right_now,
                    quantity: validate.quantity,
                });
                const data = {
                    from: validate.from,
                    to: validate.to,
                    amount,
                };
                return {
                    error: false,
                    message: "this is your general ticket",
                    data
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const obj = new general_ticket();
exports.default = obj;
//# sourceMappingURL=general_ticket.js.map