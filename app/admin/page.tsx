import { DataTable } from "@/components/table/data-table";
import StatCard from "@/components/stat-card";
import { getRecentAppointments } from "@/lib/actions/new-appointment.action";
import React from "react";
import { columns } from "@/components/table/columns";
import HeaderAdmin from "@/components/header-admin";

const AdminPage = async () => {
  const appointments = await getRecentAppointments();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <HeaderAdmin />

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome Admin,</h1>
          <p className="text-neutral-400 text-14-regular">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments?.scheduled}
            label="Scheduled Appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments?.pending}
            label="Pending Appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments?.cancelled}
            label="Cancel Appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments?.documents || []} />
      </main>
    </div>
  );
};

export default AdminPage;
