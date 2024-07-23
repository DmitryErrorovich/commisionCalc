import { useMemo } from 'react';
import {
  calculateCommissionFees,
  Operation,
} from '../utils/commissionCalculator';

interface Props {
  data: Operation[];
}

const CommissionCalculator = ({ data }: Props) => {
  const commissions = useMemo(() => {
    return calculateCommissionFees(data);
  }, [data]);

  return (
    <div>
      <h1>Commission Fees</h1>
      <ul>
        {commissions.map((fee, index) => (
          <li key={`${fee}-${index}`}>{fee.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommissionCalculator;
