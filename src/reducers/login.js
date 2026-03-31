const loginReducer = (state = false, action) => {
  if(action.type === 'Login'){
    state = true;
  }
  else if(action.type === 'Logout'){
    state = false;
  }
  return state;
}
export default loginReducer
