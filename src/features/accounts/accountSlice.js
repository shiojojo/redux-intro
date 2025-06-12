import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
  isLoading: false,
};

// Create a slice for the account feature
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    deposit: (state, action) => {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw: (state, action) => {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(loan, purpose) {
        return { payload: { loan, purpose } };
      },
      reducer(state, action) {
        if (state.loan > 0) {
          console.log('Loan already exists');
          return state;
        }
        state.balance += action.payload.loan;
        state.loan = action.payload.loan;
        state.loanPurpose = action.payload.purpose;
      },
    },
    payLoan: state => {
      state.loanPurpose = '';
      state.balance -= state.loan;
      state.loan = 0;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

// Export actions
export const { withdraw, requestLoan, payLoan, setLoading } =
  accountSlice.actions;

// Export the reducer
export default accountSlice.reducer;

// // Action creators
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
// export function withdraw(amount) {
//   return {
//     type: 'account/withdraw',
//     payload: amount,
//   };
// }
// export function requestLoan(loan, purpose) {
//   return {
//     type: 'account/requestLoan',
//     payload: { loan, purpose },
//   };
// }
// export function payLoan() {
//   return {
//     type: 'account/payLoan',
//   };
// }
