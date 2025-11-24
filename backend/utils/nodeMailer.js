import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const sendMail= async ({subject, to , text , html}) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
    });
}

export default sendMail;
