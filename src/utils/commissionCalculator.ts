interface OperationDetails {
  amount: number;
  currency: string;
}

export interface Operation {
  date: string;
  user_id: number;
  user_type: string;
  type: string;
  operation: OperationDetails;
}

const getWeekNumber = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

const calculateCommissionFees = (operations: Operation[]): number[] => {
  let userWeeklyCashOut: Record<number, Record<number, number>> = {};

  return operations.map(operation => {
    const {
      user_id,
      user_type,
      type,
      operation: { amount },
    } = operation;
    let commission = 0;

    if (type === 'cash_in') {
      commission = Math.min(amount * 0.0003, 5.0);
    } else if (type === 'cash_out') {
      if (user_type === 'natural') {
        const weekNumber = getWeekNumber(new Date(operation.date));
        userWeeklyCashOut[user_id] = userWeeklyCashOut[user_id] || {};
        userWeeklyCashOut[user_id][weekNumber] =
          userWeeklyCashOut[user_id][weekNumber] || 0;

        const totalCashOutThisWeek =
          userWeeklyCashOut[user_id][weekNumber] + amount;
        if (totalCashOutThisWeek <= 1000) {
          commission = 0;
        } else {
          const excessAmount = totalCashOutThisWeek - 1000;
          const chargeableAmount = Math.min(excessAmount, amount);
          commission = chargeableAmount * 0.003;
        }

        userWeeklyCashOut[user_id][weekNumber] += amount;
      } else if (user_type === 'juridical') {
        commission = Math.max(amount * 0.003, 0.5);
      }
    }

    return Math.ceil(commission * 100) / 100;
  });
};

export { calculateCommissionFees };
