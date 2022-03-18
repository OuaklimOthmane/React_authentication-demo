import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";

const emailReducer = function (state, action) {
  if (action.type === "USER_INPUT")
    return {
      value: action.value,
      isValid: action.value.includes("@"),
    };

  if (action.type === "ON_BLUR")
    return {
      value: state.value,
      isValid: state.value.includes("@"),
    };

  return {
    value: "",
    isValid: false,
  };
};

const passwordReducer = function (state, action) {
  if (action.type === "USER_INPUT")
    return {
      value: action.value,
      isValid: action.value.trim().length > 6,
    };

  if (action.type === "ON_BLUR")
    return {
      value: state.value,
      isValid: state.value.trim().length > 6,
    };

  return {
    value: "",
    isValid: false,
  };
};
//?  I created this "emailReducer()" function outside of the component function. And I did so because inside of this reducer function, we won't need any data that's generated inside of the component function. So this reducer function can be created outside of the scope of this component function because it doesn't need to interact with anything defined inside of the component function. All the data which will be required and used inside of the reducer function will be passed into this function when it's executed by React automatically. So that's why we can define it outside off the component function here.

const Login = (props) => {
  //! State management using "useState()" :
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  //! State management using "useReducer()" :
  const [emailState, emailDispatch] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, passwordDispatch] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  //* Extracting the validity prop from the input states :
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  //? We can use them as dependencies 'cause they're related to the inputs value, which these laters make the code re-executed whenever the value has changed and this leads to many uneccessary effect execution, therefore we use the validity properties as dependencies to make the code re-run as long as the inputs validity changed instead of their values to minimize the number of check requests. the key thing is NOT that we use destructuring but that we pass specific properties instead of the entire object as a dependency. Because the effect function would re-run whenever ANY property of the state Object changes, not just the one property our effect might depend on.

  //! Checking the form validation each time the state changes :
  useEffect(() => {
    //? Debouncing the user inputs checking using a timer :
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    //? Cleanup the timer :
    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  //! Input change handling :
  const emailChangeHandler = (event) => {
    //  setEnteredEmail(event.target.value);

    emailDispatch({
      type: "USER_INPUT",
      value: event.target.value,
    });

    // setFormIsValid(emailState.isValid && enteredPassword.trim().length > 6);
  };

  const validateEmailHandler = () => {
    //   setEmailIsValid(enteredEmail.includes("@"));

    emailDispatch({ type: "ON_BLUR" });
  };

  //! validate input handling :
  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);

    passwordDispatch({ type: "USER_INPUT", value: event.target.value });

    // setFormIsValid(event.target.value.trim().length > 6 && emailState.isValid);
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);

    passwordDispatch({ type: "ON_BLUR" });
  };

  //! Create a context consumer :
  const ctx = useContext(AuthContext);

  //! Submit form handling :
  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;

//! Debouncing the user inputs checking using a timer :
//? Debounce and throttle are two similar (but different!) techniques to control how many times we allow a function to be executed over time to avoid sending to many request during the event.

//? Let's say here, we're executing this "setFormIsValid()" essentially on every keystroke, with every keystroke, this callback runs. Now, that's not a problem here. This function execution is fairly fast. But what you do in this "setFormIsValid()", that might be a problem. cause we are updating some state. This might already not be ideal. for this simple state update it won't be a problem, but of course it means that it triggers another function component execution, and that React again needs to check whether it needs to change something in the DOM. So even that might not be something you really wanna do for every keystroke. Now imagine you would do something more complex, like, for example, send an HTTP request to some backend where you check if a username is already in use. You don't wanna do that with every keystroke. Because if you do, that means you're going to be sending a lot of requests. but that might be a lot of unnecessary network traffic. So that's something you might wanna avoid .
//? Instead, something you might want to do is that you collect a certain amount of keystrokes, or you simply wait for a pause of a certain time duration after a keystroke. And only if the pause is long enough, you go ahead and do implement "setFormIsValid()". So for example, here, while the user is actively typing, I might not wanna check if it's a valid email address. I care about when the user stops typing. So for example, when I type, and then I stop for, let's say, 500 milliseconds or longer, then I wanna check. Okay, the user seems to be done, let's see if it's valid. That's something we might wanna do. And the same for the password. Now that's a technique which is called "debouncing". We wanna debounce the user input. We wanna make sure we're not doing something with it on every keystroke, but once the user made a pause during typing. And with "useEffect", it's actually easy to implement. We can use 'setTimeout', to wait for, for example, 500 milliseconds until we execute some function. Now, in this function, we might want to check our form validity or to update our form validity. Now we would only do this after 500 milliseconds.
//? Now, the trick is that we actually save the timer. And for the next keystroke, we clear it so that we only have one ongoing timer at a time. And only the last timer will, therefore, complete. And as long as the user keeps on typing, we always clear all other timers. And therefore, we only have one timer that completes, and that completes after 500 milliseconds, which is the delay the user has to issue a new keystroke to clear this timer.

//! Cleanup function (clean the timer) :
//? In the "useEffect" function,we can return a function, for example, an anonymous arrow function. But it could also be a named function . So we are returning this anonymous arrow function,and That's a so-called "cleanup" function. This will run as a cleanup process before "useEffect" executes this "setTimeout()" the next time. then, whenever this "useEffect" function runs, before it runs, except for the very first time when it runs, this "cleanup" function will run. And in addition, the "cleanup" function will run whenever the component you're specifying the effect in unmounts from the DOM. So whenever the component is reused. So the "cleanup" function runs before every new side effect function execution and before the component is removed. And it does not run before the first side effect function execution. But thereafter, it will run before every next side effect function execution.THerefore we can use the fact that "SetTimeout" actually returns an "idetifier" ,so with the built-in clearTimeout function in my "cleanup" function. There, I call "clearTimeout" and pass the identifier of this timeout to it. And this makes sure that whenever the cleanup function runs, I clear the "timer" that was set before this "cleanup" function ran, so in the last side effect function execution, so that when the next side-effect execution is due, we are able to set a new timer. So we clear the last timer before we set a new one.
