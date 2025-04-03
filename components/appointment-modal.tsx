import React, { FC, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { CheckCheck, X } from "lucide-react";
import AppointmentForm from "./forms/appointment-form";
import { Appointment } from "@/types/appwrite.types";

interface AppointmentModalProps {
  type: "schedule" | "cancel";
  patientId: string;
  userId: string;
  appointment?: Appointment;
}

const AppointmentModal: FC<AppointmentModalProps> = ({
  type,
  patientId,
  userId,
  appointment,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={`capitalize cursor-pointer ${
            type === "schedule" ? "text-green-500" : "text-red-500"
          }`}
        >
          {type === "schedule" ? <CheckCheck /> : <X />}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader className="mb-4 space-y-1">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill the following details to {type} an appointment.
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          type={type}
          patientId={patientId}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
