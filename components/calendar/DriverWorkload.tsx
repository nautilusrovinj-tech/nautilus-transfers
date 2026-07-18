"use client";

import { Transfer } from "@/types/transfer";
import DriverWorkloadTable from "./DriverWorkloadTable";

interface Props {
  transfers: Transfer[];
}

export default function DriverWorkload({
  transfers,
}: Props) {
  return (
    <DriverWorkloadTable
      transfers={transfers}
    />
  );
}