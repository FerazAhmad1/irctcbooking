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
const traindb_1 = __importDefault(require("./traindb"));
const dbstation_1 = __importDefault(require("./dbstation"));
const dbschedule_1 = __importDefault(require("./dbschedule"));
const general_ticket_1 = __importDefault(require("./general_ticket"));
const dbcustomerticket_1 = __importDefault(require("../model/dbcustomerticket"));
const helpfn_1 = require("../helper.ts/helpfn");
class dbreservetickets extends appdb_1.appdb {
    constructor() {
        super();
        this.table = "tickets";
        this.uniqueField = "id";
    }
    count_ticket_in_a_train_at_specified_date(train_source_date, train_id, ticket_status) {
        return __awaiter(this, void 0, void 0, function* () {
            this.where = ` WHERE source_date = '${train_source_date} 'AND train_id = ${train_id} AND status = '${ticket_status}'`;
            return this.selectCount(this.table, this.uniqueField, this.where);
        });
    }
    insert_reserve_ticket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reserveticket reserveticket reserve ticket", data);
                return yield this.insertRecord(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    update_reserve_ticket(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("update reserve ticket", id, data);
                return yield this.updateRecord(id, data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    get_rserve_ticket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uniquefield, uniquefieldname, field } = data;
            this.where = `WHERE "${uniquefieldname}"='${uniquefield}'`;
            return this.select(this.table, field, this.where, '', '20');
        });
    }
    ticket_reservation(request_body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validate = Object.assign({}, request_body);
                // find train source station and destination station
                const train_query = traindb_1.default.get_train({ uniquefieldname: "t_number", uniquefield: validate.trainnumber, field: "*" });
                // find station source and destination 
                const source_station_query = dbstation_1.default.search_station({ id: validate.from_id }, "*", 1);
                const destination_station_query = dbstation_1.default.search_station({ id: validate.to_id }, "*", 1);
                const [[train], [source_station], [destination_station]] = yield Promise.all([train_query, source_station_query, destination_station_query,]);
                console.log(train, "fdsfddssdssdfsdfsdfsdfdsssfdsfsfsdfdsddfsdssdfsdfdsfsdfsfd");
                // validate train if it runs beatween selected stations
                const source_station_id = source_station.id;
                const destination_station_id = destination_station.id;
                const train_id = train.id;
                // find schedule as per station and train for both source and destination
                const source_schedule_query = dbschedule_1.default.get_schedule({ train_id, station_id: source_station_id, fields: " id,stop_order,minutes_required_to_reach_from_source_station as minutes" });
                const destination_schedule_query = dbschedule_1.default.get_schedule({ train_id, station_id: destination_station_id, fields: " id,stop_order,minutes_required_to_reach_from_source_station as minutes" });
                const [[source_schedule], [destination_schedule]] = yield Promise.all([source_schedule_query, destination_schedule_query,]);
                // check if both source schedule and destination schedule available for same train 
                if (!source_schedule || !destination_schedule) {
                    throw {
                        message: "selected train does not runs between selected source and destination",
                    };
                }
                // validate stop order
                if (source_schedule.stop_order > destination_schedule.stop_order) {
                    throw {
                        message: "selected train does not runs between selected source and destination",
                    };
                }
                const train_start_time = train.start_time;
                const source_minute = source_schedule.minutes;
                // validate Day
                const train_date = helpfn_1.validateDay(train.days, validate.startdate, train.start_time, source_minute * 1);
                if (!train_date) {
                    throw {
                        message: "Train does not run on specified date",
                    };
                }
                const formated_train_date = helpfn_1.formatDateString(train_date, "YYYY-MM-DD HH:mm:ss");
                // count number of ticket already reserved
                let count = yield this.count_ticket_in_a_train_at_specified_date(formated_train_date, train_id, 1);
                count = count * 1;
                console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL", count);
                if (count >= 250) {
                    throw {
                        message: "Not available",
                    };
                }
                if (count < 250 && count + validate.customers.length > 250) {
                    let difference = 250 - count;
                    throw {
                        message: `only ${difference} ticket is available`,
                    };
                }
                const destination_minutes = destination_schedule.minutes * 1;
                // create date  based on train running date and total minutes to reach the station from source station
                const [start_d_j, arrival_time_at_source_station] = helpfn_1.create_date(train_date, train_start_time, source_minute * 1);
                const [end_date_of_journey, arrival_time_at_destination_station] = helpfn_1.create_date(train_date, train_start_time, destination_minutes);
                const enddate = [end_date_of_journey, arrival_time_at_destination_station].join(" ");
                // generate pnr
                let pnr = Date.now().toString().slice(-7) + "123";
                // calculate amount on the basis of travelling minutes and number of customer on ticket
                const amount = helpfn_1.calculate_amount(train_id, validate.customers.length, destination_minutes - source_minute);
                const { mobile, familymobile, email, district, country, pincode, state } = validate;
                // create data for reservation
                const ticket_entry_data = {
                    quantity: validate.customers.length,
                    startdate: validate.startdate,
                    enddate,
                    amount,
                    mobile,
                    familymobile,
                    email,
                    status: 1,
                    district,
                    country,
                    pincode,
                    state,
                    pnr,
                    userid: user.id,
                    source_date: formated_train_date,
                    train_id,
                    start_schedule: source_schedule.id,
                    end_schedule: destination_schedule.id,
                };
                console.log("Ticket-entry-data", ticket_entry_data);
                const reservation_ticket_id = yield this.insert_reserve_ticket(ticket_entry_data);
                console.log(reservation_ticket_id, "$%$%$%$%$%$%$%$%**WWWWWWW");
                // insert customers in customer table
                console.log(validate);
                const customer = validate.customers.map(({ firstname, lastname, dob }) => {
                    return {
                        firstname,
                        lastname,
                        role: "customer",
                        dob: helpfn_1.formatDateString(dob, "YYYY-MM-DD HH:mm:ss"),
                    };
                });
                const query_for_Insert_Many = helpfn_1.create_insert_many_query("users", customer);
                const customer_response = yield this.insertmany(query_for_Insert_Many);
                console.log("QQQQQQQQQQQQQQsfsfsfsfsfggderewedswe", customer_response, query_for_Insert_Many);
                const start = count + 1;
                console.log(start, count);
                const all_seat = [];
                const insert_response_customer_ticket = yield Promise.all(customer_response.map((customer, i) => {
                    const seat_number = start + i;
                    all_seat.push(seat_number);
                    return dbcustomerticket_1.default.insert_customer_ticket({ seat_number, customerid: customer.id, ticketid: reservation_ticket_id });
                }));
                const data = {
                    souce_station_name: source_station.stn_name,
                    source_station_departure_time: arrival_time_at_source_station,
                    start_date_of_journey: validate.startdate,
                    destination_station_name: destination_station.stn_name,
                    seats: all_seat,
                    passengers: validate.customers,
                    end_date_of_journey,
                    arrival_time_at_destination_station,
                    train_number: validate.trainnumber,
                    pnr,
                };
                return {
                    error: false,
                    data,
                    message: "this is your ticket"
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // cancel ticket
    cancel_ticket(req_body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validate = req_body;
                const ticket = yield this.get_rserve_ticket({ uniquefield: validate.pnr, uniquefieldname: 'pnr', field: "id,status,userid" });
                if (!ticket) {
                    throw {
                        message: "this is wrong pnr",
                    };
                }
                if (ticket.length == 0) {
                    throw {
                        message: "this is wrong pnr",
                    };
                }
                let response;
                if (user.role === "railway") {
                    const response = yield this.update_reserve_ticket(ticket[0].id, {
                        status: "0",
                    });
                    console.log(response);
                    if (!response) {
                        throw {
                            message: "Internal server error",
                        };
                    }
                    return;
                }
                else if (user.id !== ticket[0].userid) {
                    throw {
                        message: "you ca not cancel other's ticket",
                    };
                }
                else {
                    const response = yield this.update_reserve_ticket(ticket[0].id, {
                        status: 0,
                    });
                    if (!response) {
                        throw {
                            message: "Internal server error",
                        };
                    }
                    return {
                        error: false,
                        message: "your ticket has been cancel",
                        dtat: {
                            pnr: validate.pnr,
                        },
                    };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    get_all_ticket(user, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const general_ticket_query = `select * from general_ticker where agentid = '${(req as CustomRequest).user.id}'  `;
                // const reservation_ticket_query = `select * from tickets where userid = '${(req as CustomRequest).user.id}' `;
                const reservation_query = this.get_rserve_ticket({ uniquefield: user.id, uniquefieldname: "userid", field: "*" });
                const general_ticket_query = general_ticket_1.default.get_general_ticket({ uniquefield: user.id, uniquefieldname: "agentid", field: "*" });
                const [resevation_ticket, general_ticket] = yield Promise.all([reservation_query, general_ticket_query]);
                let message = "success";
                if (!resevation_ticket && general_ticket) {
                    message = "you did not cut a single ticket";
                }
                return {
                    error: false,
                    message: message,
                    data: { resevation_ticket, general_ticket },
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const reservation = new dbreservetickets();
exports.default = reservation;
//# sourceMappingURL=dbreservetickets.js.map