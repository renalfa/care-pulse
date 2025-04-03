"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const HeaderAdmin = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accesskey");
    router.push("/");
  };

  return (
    <header className="admin-header">
      <Link href="/" className="cursor-pointer">
        <Image
          src="/assets/icons/logo-full.svg"
          height={32}
          width={162}
          alt="logo"
          className="h-8 w-fit"
        />
      </Link>

      <div className="flex items-center gap-8">
        <p className="text-16-semibold">Admin Dashboard</p>
        <Button
          onClick={handleLogout}
          size="icon"
          variant="outline"
          className="cursor-pointer"
        >
          <LogOutIcon className="text-red-500" />
        </Button>
      </div>
    </header>
  );
};

export default HeaderAdmin;
