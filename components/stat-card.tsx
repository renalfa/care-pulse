import clsx from "clsx";
import Image from "next/image";
import React, { FC } from "react";

interface StatCardProps {
  type: "appointments" | "pending" | "cancelled";
  count: number;
  label: string;
  icon: string;
}

const StatCard: FC<StatCardProps> = ({ type, count, label, icon }) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          width={24}
          height={24}
          alt={label}
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};

export default StatCard;
