import { Flutterwave } from "flw-sdk";

const flw = new Flutterwave(
    {
        secretKey: process.env.FLW_SECRET_KEY || '',
        publicKey: process.env.FLW_PUBLIC_KEY || '',
        timeout: 10000, // 10 seconds timeout
        webhookSecret: process.env.FLW_SECRET_HASH || ''
    }
);

export default flw;