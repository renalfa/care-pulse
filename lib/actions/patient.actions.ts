"use server";

import { ID, Query } from "node-appwrite";
import {
  BUCKET_ID,
  database,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    console.log(newUser);

    return parseStringify(newUser);
  } catch (error: any) {
    console.error(error);

    if (error && error?.code === 409) {
      const docs = await users.list([Query.equal("email", [user.email])]);

      return docs?.users?.[0];
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const patient = await users.get(userId);

    return parseStringify(patient);
  } catch (error) {
    console.error(error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await database.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    console.log(patient);

    const newPatient = await database.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocument: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error(error);
  }
};
