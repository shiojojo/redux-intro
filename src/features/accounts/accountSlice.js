const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
  isLoading: false,
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case 'account/deposit':
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
      };
    case 'account/withdraw':
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case 'account/requestLoan':
      if (state.loan > 0) {
        console.log('Loan already exists');
        return state;
      }
      return {
        ...state,
        balance: state.balance + action.payload.loan,
        loan: action.payload.loan,
        loanPurpose: action.payload.purpose,
      };
    case 'account/payLoan':
      return {
        ...state,
        loanPurpose: '',
        balance: state.balance - state.loan,
        loan: 0,
      };
    case 'account/loading':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Action creators
export function deposit(amount, currency) {
  if (currency === 'USD')
    return {
      type: 'account/deposit',
      payload: amount,
    };
  return async function (dispatch, getState) {
    dispatch({ type: 'account/loading', payload: true });

    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    if (!res.ok) {
      console.error('Failed to fetch exchange rate');
      return;
    }
    const data = await res.json();
    const amountInUSD = data.rates.USD;
    dispatch({
      type: 'account/deposit',
      payload: amountInUSD,
    });
  };
}
export function withdraw(amount) {
  return {
    type: 'account/withdraw',
    payload: amount,
  };
}
export function requestLoan(loan, purpose) {
  return {
    type: 'account/requestLoan',
    payload: { loan, purpose },
  };
}
export function payLoan() {
  return {
    type: 'account/payLoan',
  };
}
