"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ADMIN_PASSKEY } from "@/constants";
import { decryptKey, encryptKey } from "@/lib/utils";

const PasskeyModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(true);
  const [passkey, setPasskey] = useState<string>("");
  const [error, setError] = useState<string>("");

  const encryptedPasskey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accesskey")
      : null;

  useEffect(() => {
    const accessKey = encryptedPasskey && decryptKey(encryptedPasskey);
    
    if (pathname) {
      if (accessKey === ADMIN_PASSKEY) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
    }
  }, [encryptedPasskey]);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePasskey = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (passkey === ADMIN_PASSKEY) {
      const encryptedPasskey = encryptKey(passkey);

      localStorage.setItem("accesskey", encryptedPasskey);

      setOpen(false);
    } else {
      setError("Invalid passkey. Please try again!");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={closeModal}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin panel, please verify your passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            className="shad-primary-btn w-full"
            onClick={(e) => validatePasskey(e)}
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
