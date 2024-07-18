import React from "react";
import dayjs, { Dayjs } from "dayjs";

function getFinancialYearStart(): Dayjs {
  const today = dayjs();
  const currentYear = today.year();
  const startOfFinancialYear =
    today.month() < 3
      ? dayjs(`${currentYear - 1}-04-01`).startOf("day")
      : dayjs(`${currentYear}-04-01`).startOf("day");
  return startOfFinancialYear;
}

function getFinancialYearEnd(): Dayjs {
  const today = dayjs();
  const currentYear = today.year();
  const endOfFinancialYear =
    today.month() < 3
      ? dayjs(`${currentYear}-03-31`).endOf("day")
      : dayjs(`${currentYear + 1}-03-31`).endOf("day");
  return endOfFinancialYear;
}

export { getFinancialYearStart, getFinancialYearEnd };
