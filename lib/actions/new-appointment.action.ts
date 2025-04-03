"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  database,
  DATABASE_ID,
} from "../appwrite.config";
import { parseStringify, formatDateTime } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { sendSMSNotification } from "./sms.action";

export const createAppointment = async (data: CreateAppointmentParams) => {
  try {
    const newAppointment = await database.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      data
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.error(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await database.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(error);
  }
};

export const getRecentAppointments = async () => {
  try {
    const appointments = await database.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduled: 0,
      cancelled: 0,
      pending: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, doc) => {
        if (doc.status === "scheduled") acc.scheduled += 1;
        else if (doc.status === "cancelled") acc.cancelled += 1;
        else if (doc.status === "pending") acc.pending += 1;

        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await database.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error("Failed to update appointment");
    }

    const smsMessage = ` 
Hello,

${
type === "schedule"
? `Your appointment has been scheduled for ${
formatDateTime(appointment.schedule).dateTime
} with Dr. ${appointment.primaryPhysician}.`
: `Your appointment has been cancelled. Reason: ${appointment.cancellationReason}`
      }

Best regards,
CarePulse
    `;

    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error(error);
  }
};
