// src/services/mpesa/stkPush.ts
import axios from 'axios';

export class MpesaSTKPush {
  private baseURL: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    this.baseURL = __DEV__ 
      ? 'https://sandbox.safaricom.co.ke' 
      : 'https://api.safaricom.co.ke';
    this.consumerKey = 'YOUR_CONSUMER_KEY';
    this.consumerSecret = 'YOUR_CONSUMER_SECRET';
  }

  async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    
    const response = await axios.get(`${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    return response.data.access_token;
  }

  async initiateSTKPush(phoneNumber: string, amount: number, accountReference: string) {
    const accessToken = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const stkPushData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.API_BASE_URL}/mpesa/callback`,
      AccountReference: accountReference,
      TransactionDesc: 'MSplit Payment',
    };

    const response = await axios.post(
      `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }
}