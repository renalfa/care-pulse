import { ID } from "node-appwrite";
import { messaging } from "../appwrite.config";
import { parseStringify } from "../utils";

export const sendSMSNotification = async (userId: string, msg: string) => {
  try {
    const message = await messaging.createSms(ID.unique(), msg, [], [userId]);

    return parseStringify(message);
  } catch (error) {
    console.error(error);
  }
};
