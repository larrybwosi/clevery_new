import { KindeSDK } from '@kinde-oss/react-native-sdk-0-7x';
import { endpoint } from './env';

const YOUR_KINDE_ISSUER=process.env.KINDE_ISSUER_URL!
const KINDE_POST_CALLBACK_URL= process.env.KINDE_POST_CALLBACK_URL!
const KINDE_CLIENT_ID=process.env.KINDE_CLIENT_ID!
const KINDE_LOGOUT_REDIRECT_URL = process.env.KINDE_POST_LOGOUT_REDIRECT_URL!

export const authClient = new KindeSDK(
  YOUR_KINDE_ISSUER, 
  KINDE_POST_CALLBACK_URL, 
  KINDE_CLIENT_ID, 
  KINDE_LOGOUT_REDIRECT_URL,
  // {
  //   audience: endpoint
  // }
);
