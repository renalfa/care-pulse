import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_KEY: process.env.API_KEY,
    NEXT_PUBLIC_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
    DATABASE_ID: process.env.DATABASE_ID,
    PATIENT_COLLECTION_ID: process.env.PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID: process.env.DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID: process.env.APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: process.env.NEXT_PUBLIC_BUCKET_ID,
    PROJECT_ID: process.env.PROJECT_ID,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
