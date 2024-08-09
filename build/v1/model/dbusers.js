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
const helpfn_1 = require("../helper.ts/helpfn");
const bcrypt_1 = __importDefault(require("bcrypt"));
const helpfn_2 = require("../helper.ts/helpfn");
const html_1 = __importDefault(require("../helper.ts/html"));
const crypto_1 = __importDefault(require("crypto"));
class dbusers extends appdb_1.appdb {
    constructor() {
        super();
        this.table = "users";
        this.uniqueField = "id";
    }
    static whereClause(obj) {
        let where = "WHERE ";
        for (let key in obj) {
            where += `${key} = '${obj[key]}' `;
        }
        return where;
    }
    insertUser(userObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.insertRecord(userObj);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUser(login_body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.where = dbusers.whereClause(login_body);
                this.page = 1;
                this.rpp = 1;
                this.orderby = "";
                const user = yield this.listRecords("*");
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update_user(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setClauses = Object.entries(data).map(([key, value]) => {
                    if (value === null) {
                        return `${key} = NULL`;
                    }
                    else {
                        return `${key} = '${value}'`;
                    }
                }).join(', ');
                this.where = `WHERE id = '${id}'`;
                const query = `UPDATE ${this.table} SET ${setClauses} ${this.where} `;
                return this.executeQuery(query);
            }
            catch (error) {
                throw error;
            }
        });
    }
    signup_otp(req_body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validate = req_body;
                const { email } = validate;
                const db_user = yield this.getUser({ email });
                if (db_user.length > 0) {
                    const { password = null } = db_user[0];
                    if (password) {
                        throw {
                            message: "this email is already registered with us",
                        };
                    }
                    const { otp_expiry } = db_user[0];
                    // otp is not null and it is not expired yet
                    if (otp_expiry && new Date(otp_expiry) > new Date()) {
                        // resend the same otp
                        const { otp } = db_user[0];
                        const mailResponse = yield helpfn_1.send_otp(otp, email);
                        return {
                            error: false,
                            message: "a six digit otp has been sended to your email",
                            data: { otp },
                        };
                    }
                    // otp is not null and expired
                    if (otp_expiry && new Date(otp_expiry) < new Date()) {
                        // resend new otp and set new expiry time
                        const otp = helpfn_1.generateOTP();
                        const newExpirytime = helpfn_1.formatDateString(new Date(Date.now() + 10 * 60 * 1000), "YYYY-MM-DD HH:mm:ss");
                        const { id } = db_user[0];
                        const response = yield this.update_user(id, {
                            otp_expiry: newExpirytime,
                            otp,
                        });
                        if (!response) {
                            throw { message: "error is coming from update_user" };
                        }
                        const mailResponse = yield helpfn_1.send_otp(otp, email);
                        return ({
                            error: false,
                            message: "a six digit otp has been sended to your email",
                            data: { otp },
                        });
                    }
                }
                const otp = helpfn_1.generateOTP();
                const newExpirytime = helpfn_1.formatDateString(new Date(Date.now() + 10 * 60 * 1000), "YYYY-MM-DD HH:mm:ss");
                const insertUser_response = yield this.insertUser({
                    email,
                    otp,
                    otp_expiry: newExpirytime,
                });
                if (!insertUser_response) {
                    throw { message: "error is coming from insertUser method" };
                }
                const mailResponse = yield helpfn_1.send_otp(otp, email);
                return ({
                    error: false,
                    message: "a six digit otp has been sended to your email",
                    data: { otp },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyotp(req_body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validate = req_body;
                const db_user = yield this.getUser({ email: validate.email });
                if (db_user.length === 0) {
                    throw { message: "user not found" };
                }
                const { otp: dbotp, otp_expiry } = db_user[0];
                if (new Date(otp_expiry) < new Date()) {
                    throw {
                        message: "otp has been expire",
                    };
                }
                console.log(db_user);
                if (validate.otp * 1 !== dbotp) {
                    throw {
                        message: "Incorrect otp",
                    };
                }
                const { firstName: firstname, lastName: lastname, password, email, mobile, } = validate;
                const id = db_user[0].id;
                const hashed_password = yield bcrypt_1.default.hash(password, 12);
                const updateUser = yield user.update_user(id * 1, {
                    firstname,
                    lastname,
                    password: hashed_password,
                    email,
                    mobile,
                    otp: null,
                    otp_expiry: null,
                });
                if (!updateUser) {
                    throw {
                        message: "error is coming from update_user",
                    };
                }
                const token = helpfn_2.signToken(id);
                return {
                    error: false,
                    message: "user is signup successfully",
                    data: {
                        token,
                    },
                };
            }
            catch (error) {
                const err = error;
                throw error;
            }
        });
    }
    login(req_body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validate = req_body;
                const { email = null, password: login_password = null } = req_body;
                const db_user = yield this.getUser({ email });
                if (db_user.length === 0) {
                    throw { message: "This email is not registed" };
                }
                const { password: db_password, id } = db_user[0];
                const validate_password = yield bcrypt_1.default.compare(login_password, db_password);
                if (!validate_password) {
                    throw { message: "email or password is wrong" };
                }
                const token = helpfn_2.signToken(id);
                return {
                    error: false,
                    message: "login successfull",
                    data: { token },
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    update_role(req_body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = { role: "agent" };
                const response = yield this.update_user(user.id, data);
                if (response !== 1) {
                    throw {
                        message: "Internal server error",
                    };
                }
                const data_to_send = Object.assign(Object.assign({}, user), { role: "agent", reset_password_token: undefined, change_password_at: undefined, password: undefined });
                return {
                    error: false,
                    message: "you are now agent",
                    data: { updated_user: data_to_send },
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    forgot_password(req_body, protocol, host) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validate = req_body;
                const response = yield user.getUser({ email: validate.email });
                if (response.length === 0) {
                    throw {
                        message: "this email does not exist with us",
                    };
                }
                const [random_token, hashed_token] = helpfn_1.create_random_token();
                yield user.update_user(response[0].id, {
                    reset_password_token: hashed_token,
                });
                const reset_link = `${protocol}://${host}/v1/user/resetpassword/${random_token}`;
                let html = html_1.default.replace("REPLACE_WITH_HTML_CONTENT", "<p>To reset password please click on below tab</p>");
                html = html.replace("REPLACE_WITH_LINK", reset_link);
                html = html.replace("REPLACE_WITH_TAB", "reset password");
                const subject = "reset your password";
                const sender = "feraz@gmail.com";
                const mail_response = yield helpfn_2.send_mail({
                    html,
                    sender,
                    subject,
                    reciever: validate.email,
                });
                return {
                    error: false,
                    message: "resetlink hasbeen sended to your email",
                    data: { reset_link },
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    reset_password(req_body, token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validate = req_body;
                if (!token) {
                    throw {
                        message: "you are not autorize to perform this action ",
                    };
                }
                const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
                const query_find_user = `select * from users where reset_password_token = '${hashedToken}'`;
                const requested_user = yield user.executeQuery(query_find_user);
                if (!requested_user) {
                    throw {
                        message: "Invalid user",
                    };
                }
                if (requested_user[0].email !== validate.email) {
                    throw { message: "unauthorize user" };
                }
                const hashed_password = yield bcrypt_1.default.hash(password, 12);
                const query_update_password = yield user.update_user(requested_user[0].id, {
                    password: hashed_password,
                });
                if (!query_update_password) {
                    throw {
                        errorCode: 500,
                        message: "internal server error",
                    };
                }
                return {
                    error: false,
                    message: "your password has been change successfully",
                    data: {},
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.dbusers = dbusers;
const user = new dbusers();
exports.default = user;
//# sourceMappingURL=dbusers.js.map