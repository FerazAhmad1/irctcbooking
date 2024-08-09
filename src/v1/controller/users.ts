import { Request, Response } from "express";
import user from "../model/dbusers";



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

export const signup_otp = async (req: Request, res: Response) => {
  try {
    const response = await user.signup_otp(req.body)
    if (!response || response.error) {
      throw {
        message: response?.message || "your model function is not working"
      }
    }
    res.status(200).json(response)
  } catch (error) {
    const err = error as any;
    res.status(400).json({
      error: true,
      message: err.message || "UNEXPECTED ERROR",
      data: {},
    });
  }
};

export const verify_otp = async (req: Request, res: Response) => {
  try {
    const response = await user.verifyotp(req.body)
    if (!response || response.error) {
      throw {
        message: response?.message || "your model function is not working"
      }
    }
    res.status(200).json(response)
  } catch (error) {
    const err = error as any;
    res.status(400).json({
      error: true,
      message: err.message || "UNEXPECTED ERROR",
      data: {},
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const response = await user.login(req.body)
    if (!response || response.error) {
      throw {
        message: response?.message || "your model function is not working"
      }
    }
    res.status(200).json(response)
  } catch (error) {
    const err = error as any;
    res.status(400).json({
      error: true,
      message: err.message || "UNEXPECTED ERROR",
      data: {},
    });
  }
};

export const update_role = async (req: any, res: Response) => {
  try {

    const response = await user.update_role(req.body, req.user);
    if (!response || response.error) {
      throw {
        message: response?.message || "your model function is not working"
      }
    }
    res.status(200).json(response);

  } catch (error) {
    const err = error as any;
    res.status(500).json({
      error: true,
      message: err.message || "UNEXPECTED ERROR",
      data: {},
    });
  }
};

export const forgot_password = async (req: Request, res: Response) => {
  try {
    const host = req.get("host");
    const protocol = req.protocol
    const response = await user.forgot_password(req.body, protocol, host);
    if (!response || response.error) {
      throw {
        message: response?.message || "your model function is not working"
      }
    }
    res.status(200).json(response);
  } catch (error) {
    const err = error as any;
    res.status(400).json({
      error: true,
      message: err.message || "UNEXPECTED ERROR",
      data: {},
    });
  }
};


export const reset_password = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const password = req.body.password;
    const response = await user.reset_password(req.body, token, password);
    if (!response || response.error) {
      throw {
        message: response?.message || "your model function is not working"
      }
    }
    res.status(200).json(response);

  } catch (error) {
    const err = error as any;
    res.status(err.errorCode || 401).json({
      error: true,
      message: err.message || "UNEXPECTED ERROR",
      data: {},
    });
  }
};
