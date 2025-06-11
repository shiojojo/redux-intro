import { createStore, combineReducers } from 'redux';

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
};

const initialStateCustomer = {
  fullName: '',
  nationalID: '',
  createdAt: '',
};

function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case 'customer/createCustomer':
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      };
    case 'customer/updateName':
      return { ...state, fullName: action.payload };
    default:
      return state;
  }
}

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case 'account/deposit':
      return {
        ...state,
        balance: state.balance + action.payload,
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
    default:
      return state;
  }
}

const store = createStore(
  combineReducers({
    account: accountReducer,
    customer: customerReducer,
  })
);
// Action creators
function deposit(amount) {
  return {
    type: 'account/deposit',
    payload: amount,
  };
}
function withdraw(amount) {
  return {
    type: 'account/withdraw',
    payload: amount,
  };
}
function requestLoan(loan, purpose) {
  return {
    type: 'account/requestLoan',
    payload: { loan, purpose },
  };
}
function payLoan() {
  return {
    type: 'account/payLoan',
  };
}

function createCustomer(fullName, nationalID, createdAt) {
  return {
    type: 'customer/createCustomer',
    payload: { fullName, nationalID, createdAt },
  };
}
function updateCustomerName(name) {
  return {
    type: 'customer/updateName',
    payload: name,
  };
}

console.log('Initial State:', store.getState());
store.dispatch(deposit(1000));
console.log('State after deposit:', store.getState());
store.dispatch(withdraw(200));
console.log('State after withdrawal:', store.getState());
store.dispatch(requestLoan(500, 'Home Renovation'));
console.log('State after requesting loan:', store.getState());
store.dispatch(payLoan());
console.log('State after paying loan:', store.getState());

store.dispatch(
  createCustomer('John Doe', '123456789', new Date().toISOString())
);
console.log('State after creating customer:', store.getState());
store.dispatch(updateCustomerName('Jane Doe'));
console.log('State after updating customer name:', store.getState());
