"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml = exports.mailSent = exports.GenerateOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    return { otp };
};
exports.GenerateOTP = GenerateOTP;
const transport = nodemailer_1.default.createTransport({
    service: "gmail" /*service and host are the same thing */,
    auth: {
        user: config_1.GMAIL_USER,
        pass: config_1.GMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const mailSent = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: config_1.FromAdminMail,
            to,
            subject: config_1.userSubject,
            html,
        });
        return response;
    }
    catch (err) {
        console.log(err);
    }
};
exports.mailSent = mailSent;
const emailHtml = (otp) => {
    let response = `
      <div style="max-width:700px;
      margin:auto;
      border:10px solid #ddd;
      padding:50px 20px;
      font-size: 110%;
      font-style: italics
      "> 
      <h2 style="text-align:center;
      text-transform:uppercase;
      color:teal;
      ">
      User Auth
      </h2>
      <p>${otp} </p>
      <p>Hi there, use the otp to verify your account.</p>
      <h3>DO NOT DISCLOSE TO ANYONE<h3>
      </div>
      `;
    return response;
};
exports.emailHtml = emailHtml;
