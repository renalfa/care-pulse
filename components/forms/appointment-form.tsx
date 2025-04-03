"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import MyFormField from "../my-form-field";
import SubmitButton from "../submit-button";
import { FC, useState } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import { Doctors } from "@/constants";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/new-appointment.action";
import { Appointment } from "@/types/appwrite.types";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface AppointmentFormProps {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
}

const AppointmentForm: FC<AppointmentFormProps> = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const appointmentSchema = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason: appointment ? appointment.reason : "",
      note: appointment ? appointment.note : "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  async function onSubmit(values: z.infer<typeof appointmentSchema>) {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }

    try {
      if (type === "create" && patientId) {
        const payload = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: values.schedule,
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };

        const response = await createAppointment(payload);

        if (response) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${response.$id}`
          );
        }
      } else {
        console.log("update");
        const payload = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const response = await updateAppointment(payload);

        console.log(response);

        if (response) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <MyFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex items-center cursor-pointer gap-2">
                    <Image
                      src={doctor.image}
                      height={32}
                      width={32}
                      alt={doctor.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span>{doctor.name}</span>
                  </div>
                </SelectItem>
              ))}
            </MyFormField>

            <MyFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected Appointment Date"
              showTime
              dateFormat="MM/dd/yyyy - h:mm aa"
              placeholder="Select a date and time"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <MyFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for Appointment"
                placeholder="Enter reason for appointment"
              />

              <MyFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Additional Notes"
                placeholder="Enter additional notes"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <MyFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Cancellation Reason"
            placeholder="Enter cancellation reason"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {type === "cancel"
            ? "Cancel Appointment"
            : type === "schedule"
            ? "Schedule Appointment"
            : "Request Appointment"}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
