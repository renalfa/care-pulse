"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import MyFormField from "../my-form-field";
import SubmitButton from "../submit-button";
import { useState } from "react";
import { patientSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./patient-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../file-uploader";

interface RegisterFormProps {
  user: User;
}

const RegisterForm = ({ user }: RegisterFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(data: z.infer<typeof patientSchema>) {
    console.log(data);
    setIsLoading(true);

    let formData;

    if (data.identificationDocument && data.identificationDocument.length > 0) {
      const blobFile = new Blob([data.identificationDocument[0]], {
        type: data.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", data.identificationDocument[0].name);
    }

    try {
      const payload = {
        ...data,
        userId: user.$id,
        birthDate: new Date(data.birthDate),
        identificationDocument: formData,
      };

      // @ts-ignore
      const res = await registerPatient(payload);

      if (res) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <MyFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <MyFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="jhondoe@example.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <MyFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(123) 456-7890"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <MyFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
            placeholder="jhondoe@example.com"
          />

          <MyFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex h-11 gap-3 xl:justify-between"
                >
                  {GenderOptions.map((gender) => (
                    <div key={gender} className="radio-group">
                      <RadioGroupItem value={gender} id={gender} />
                      <Label
                        htmlFor={gender}
                        className="cursor-pointer text-dark-600"
                      >
                        {gender}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <MyFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="123 Main St"
          />

          <MyFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Engineer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <MyFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's Name"
          />

          <MyFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(123) 456-7890"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <MyFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select Primary Physician"
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

        <div className="flex flex-col gap-6 xl:flex-row">
          <MyFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="United Health"
          />

          <MyFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <MyFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Latex, etc."
          />

          <MyFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg, etc."
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <MyFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History (if relevant)"
            placeholder="Diabetes, Hypertension, etc."
          />

          <MyFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Heart attack, Stroke, etc."
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <MyFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an Identification Type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </MyFormField>

        <MyFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
        />

        <MyFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scan Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <div className="w-full flex flex-col gap-6">
          <MyFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment and care from the primary physician."
          />

          <MyFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the disclosure of my personal information to the primary physician."
          />

          <MyFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I agree to the privacy policy."
          />
        </div>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
