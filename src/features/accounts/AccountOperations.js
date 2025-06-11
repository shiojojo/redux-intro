import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deposit, withdraw, requestLoan, payLoan } from './accountSlice'; // Adjust the import path as necessary

function AccountOperations() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [currency, setCurrency] = useState('USD');

  const dispatch = useDispatch();

  const {
    loan: currentLoan,
    loanPurpose: currentLoanPurpose,
    balance,
    isLoading,
  } = useSelector(state => state.account);

  function handleDeposit() {
    if (!depositAmount || depositAmount <= 0) {
      alert('Please enter a valid deposit amount.');
      return;
    }
    dispatch(deposit(depositAmount, currency));
    setDepositAmount('');
    setCurrency('USD');
  }

  function handleWithdrawal() {
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      alert('Please enter a valid withdrawal amount.');
      return;
    }
    if (withdrawalAmount > balance) {
      alert('Insufficient funds for this withdrawal.');
      return;
    }
    dispatch(withdraw(withdrawalAmount));
    setWithdrawalAmount('');
  }

  function handleRequestLoan() {
    if (!loanAmount || loanAmount <= 0) {
      alert('Please enter a valid loan amount.');
      return;
    }
    if (currentLoan > 0) {
      alert('You already have an existing loan.');
      return;
    }
    dispatch(requestLoan(loanAmount, loanPurpose));
    setLoanAmount('');
    setLoanPurpose('');
  }

  function handlePayLoan() {
    if (currentLoan <= 0) {
      alert('You have no outstanding loan to pay back.');
      return;
    }
    dispatch(payLoan());
  }

  return (
    <div>
      <h2>Your account operations</h2>
      <div className="inputs">
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={depositAmount}
            onChange={e => setDepositAmount(+e.target.value)}
          />
          <select value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
          </select>

          <button onClick={handleDeposit} disabled={isLoading}>
            {isLoading ? 'Loading...' : `Deposit ${depositAmount}`}
          </button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={withdrawalAmount}
            onChange={e => setWithdrawalAmount(+e.target.value)}
          />
          <button onClick={handleWithdrawal}>
            Withdraw {withdrawalAmount}
          </button>
        </div>

        <div>
          <label>Request loan</label>
          <input
            type="number"
            value={loanAmount}
            onChange={e => setLoanAmount(+e.target.value)}
            placeholder="Loan amount"
          />
          <input
            value={loanPurpose}
            onChange={e => setLoanPurpose(e.target.value)}
            placeholder="Loan purpose"
          />
          <button onClick={handleRequestLoan}>Request loan</button>
        </div>

        {currentLoan > 0 && (
          <div>
            <span>Pay back {currentLoan} </span>
            <button onClick={handlePayLoan}>Pay loan</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountOperations;
