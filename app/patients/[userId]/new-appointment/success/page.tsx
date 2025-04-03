import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/new-appointment.action";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SuccessAppointmentPage = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            width={1000}
            height={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            width={300}
            height={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p className="text-14-regular">
            We will be in touch shortly to confirm your appointment.
          </p>
        </section>

        <section className="request-details text-14-regular">
          <p>Request appointment details:</p>

          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              width={100}
              height={100}
              alt={doctor?.name!}
              className="size-8"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>

          <div className="flex gap-2 items-center">
            <Image
              src="/assets/icons/calendar.svg"
              width={24}
              height={24}
              alt="calender"
            />
            <p className="text-neutral-400">{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New appointment
          </Link>
        </Button>

        <div className="text-14-regular py-10 flex justify-center">
          <p className=" text-dark-600">© 2025, Care Pulse</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessAppointmentPage;
