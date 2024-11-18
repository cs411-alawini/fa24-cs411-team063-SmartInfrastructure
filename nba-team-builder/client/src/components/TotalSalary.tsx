import React from 'react';

interface TotalSalaryProps {
  totalSalary: number;
}

const TotalSalary: React.FC<TotalSalaryProps> = ({ totalSalary }) => (
  <div className="total-salary">
    <h2>Total Salary Cost: ${totalSalary.toLocaleString()}</h2>
  </div>
);

export default TotalSalary;
