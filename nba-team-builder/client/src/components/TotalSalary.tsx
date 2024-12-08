import React from 'react';
import './styles/TotalSalary.css'

interface TotalSalaryProps {
  totalSalary: number;
  penalty: number;
  isSubmitted: boolean;
  
}

const TotalSalary: React.FC<TotalSalaryProps> = ({ totalSalary, penalty, isSubmitted }) => {
  var totalSalaryDisplay = totalSalary;
  if(isSubmitted) totalSalaryDisplay += penalty;
  return (
    <>
    { isSubmitted ? (
      <div className="penalty-message">
        {`${penalty} worth of penalties applied`}
      </div>
    ) : (
      <>
      </>
    )
  }
    <div className="total-salary">
      <h2>Total Salary Cost: ${totalSalaryDisplay.toLocaleString()}</h2>
    </div>
    </>
  );
};

export default TotalSalary;
