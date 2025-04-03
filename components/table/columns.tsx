"use client";

import { Appointment } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../status-badge";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import Image from "next/image";
import AppointmentModal from "../appointment-modal";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-14-medium">{row.index + 1}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-14-medium">{row.original.patient.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <StatusBadge status={row.original.status} />;
    },
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-14-regular">
            {formatDateTime(row.original.schedule).dateTime}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doctor) => doctor.name === row.original.primaryPhysician
      );

      return (
        <div className="flex items-center gap-2">
          <Image
            src={doctor?.image!}
            alt={doctor?.name!}
            width={24}
            height={24}
            className="size-8 w-fit"
          />
          <p className="text-14-regular whitespace-nowrap">{doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <AppointmentModal
            type="schedule"
            patientId={row.original.patient.$id}
            userId={row.original.userId}
            appointment={row.original}
          />

          <AppointmentModal
            type="cancel"
            patientId={row.original.patient.$id}
            userId={row.original.userId}
            appointment={row.original}
          />
        </div>
      );
    },
  },
];
