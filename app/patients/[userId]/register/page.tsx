"use server";

import RegisterForm from "@/components/forms/register-form";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";

const RegisterPage = async ({ params: { userId } }: SearchParamProps) => {
  const user: User = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10 ">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <div className="text-14-regular py-10 flex justify-center">
            <p className=" text-dark-600">© 2025, Care Pulse</p>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        width={1000}
        height={1000}
        alt="patient"
        className="side-img max-w-[392px]"
      />
    </div>
  );
};

export default RegisterPage;
