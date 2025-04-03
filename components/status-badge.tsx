import { StatusIcon } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import React, { FC } from "react";

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "scheduled",
        "bg-red-600": status === "cancelled",
        "bg-blue-600": status === "pending",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className="w-3 h-fit"
      />
      <p className={clsx("text-12-semibold capitalize", {
        "text-green-500": status === "scheduled",
        "text-red-500": status === "cancelled",
        "text-blue-500": status === "pending",
      })}>{status}</p>
    </div>
  );
};

export default StatusBadge;
