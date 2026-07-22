import { BUFFER_MATURITY_DAYS } from "../constant";

export function calculateMaturityDate(maturityDay: number) {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  let maturityMonth = currentMonth;
  if (currentDay - maturityDay > BUFFER_MATURITY_DAYS) {
    maturityMonth = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
  }

  return new Date(currentYear, maturityMonth, maturityDay); // Return month as 1-12
}

export function calculateStatementDate(statementDay: number, maturityStatementDiff: number, maturityDate: Date) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  let statementMonth = maturityDate.getMonth();
  if (maturityStatementDiff < 0) {
    statementMonth = statementMonth - 1 < 0 ? 11 : statementMonth - 1; 
  }

  return new Date(currentYear, statementMonth, statementDay); // Return month as 1-12
}

export function calculateDaysUntilStatement(statementDate: Date): number {
  const currentDate = new Date();
  const dayDiff = statementDate.getTime() - currentDate.getTime();
  return Math.ceil(dayDiff / (1000 * 60 * 60 * 24));
}

export function calculateDaysUntilMaturity(maturityDate: Date): number {
  const currentDate = new Date();
  const dayDiff = maturityDate.getTime() - currentDate.getTime();
  return Math.ceil(dayDiff / (1000 * 60 * 60 * 24));
}