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
const appdb_1 = require("../model/appdb");
const dbstation_1 = __importDefault(require("./dbstation"));
const dbschedule_1 = __importDefault(require("./dbschedule"));
const helpfn_1 = require("../helper.ts/helpfn");
class traindb extends appdb_1.appdb {
    constructor() {
        super();
        this.table = "train";
    }
    get_train(train_data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.where = `WHERE "${train_data.uniquefieldname}"='${train_data.uniquefield}'`;
                const train = yield this.select(this.table, train_data.field, this.where, '', '');
                return train;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    search_train(req_body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validate = req_body;
                let page = validate.page * 1;
                // need station id of source and destination
                const from_station_query = dbstation_1.default.search_station({ id: validate.from_station_id }, "*", 1);
                const destination_station_query = dbstation_1.default.search_station({ id: validate.to_station_id }, "*", 1);
                const [[from_station], [to_staion]] = yield Promise.all([from_station_query, destination_station_query]);
                console.log(to_staion, from_station);
                if (!from_station) {
                    throw { message: " source station not found " };
                }
                if (!to_staion) {
                    throw {
                        message: "no destination station found",
                    };
                }
                const from_station_id = from_station.id;
                const to_staion_id = to_staion.id;
                console.log(from_station, to_staion);
                // fetch all trains that runs beatwean the station
                const field = `s1.train_id as from_train_id,s1.minutes as from_minutes, s1.stop_order as from_stop_order,s2.train_id  as end_train_id,s2.minutes as end_minutes ,s2.stop_order as end_stop_order from schedule s1 JOIN schedule s2 ON s1.train_id=s2.train_id `;
                const scheduledTrain = yield dbschedule_1.default.get_trains_from_source_to_destination(from_station_id, to_staion_id, field, page);
                const day = new Date(validate.date_of_journey).getDay();
                const trains_at_that_day = yield Promise.all(scheduledTrain.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    const train = yield this.get_train({ uniquefield: obj.from_train_id, uniquefieldname: "id", field: `days,start_time,t_number ` });
                    const days = train[0].days;
                    const start_time = train[0].start_time;
                    const b = days[day] * 1 === 1;
                    const train_number = train[0].t_number;
                    console.log(b);
                    if (b) {
                        const [end_date_of_journey, end_time] = helpfn_1.create_date(validate.date_of_journey, start_time, obj.end_minutes * 1);
                        return Object.assign(Object.assign({}, obj), { start_station_name: from_station.stn_name, end_station_name: to_staion.stn_name, start_date_of_journey: validate.date_of_journey, start_time: start_time, end_date_of_journey,
                            end_time,
                            train_number });
                    }
                    return {};
                })));
                return {
                    error: false,
                    message: "this is available train for your journey ",
                    data: trains_at_that_day,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const train_obj = new traindb();
exports.default = train_obj;
//# sourceMappingURL=traindb.js.map