import React, { useState, useEffect } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const Login = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  //! Checking the form validation each time the state changes :
  useEffect(() => {
    //* Debouncing the user inputs checking using a timer :
    const identifier = setTimeout(() => {
      setFormIsValid(
        enteredEmail.includes("@") && enteredPassword.trim().length > 6
      );
    }, 500);
  }, [enteredEmail, enteredPassword]);

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);

    // setFormIsValid(
    //   event.target.value.includes('@') && enteredPassword.trim().length > 6
    // );
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);

    // setFormIsValid(
    //   event.target.value.trim().length > 6 && enteredEmail.includes('@')
    // );
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes("@"));
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
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
//? Let's say here, we're executing this "setFormIsValid()" essentially on every keystroke, with every keystroke, this callback runs. Now, that's not a problem here. This function execution is fairly fast. But what you do in this "setFormIsValid()", that might be a problem. cause we are updating some state. This might already not be ideal. for this simple state update it won't be a problem, but of course it means that it triggers another function component execution, and that React again needs to check whether it needs to change something in the DOM. So even that might not be something you really wanna do for every keystroke. Now imagine you would do something more complex, like, for example, send an HTTP request to some backend where you check if a username is already in use. You don't wanna do that with every keystroke. Because if you do, that means you're going to be sending a lot of requests. but that might be a lot of unnecessary network traffic. So that's something you might wanna avoid .
//? Instead, something you might want to do is that you collect a certain amount of keystrokes, or you simply wait for a pause of a certain time duration after a keystroke. And only if the pause is long enough, you go ahead and do implement "setFormIsValid()". So for example, here, while the user is actively typing, I might not wanna check if it's a valid email address. I care about when the user stops typing. So for example, when I type, and then I stop for, let's say, 500 milliseconds or longer, then I wanna check. Okay, the user seems to be done, let's see if it's valid. That's something we might wanna do. And the same for the password. Now that's a technique which is called "debouncing". We wanna debounce the user input. We wanna make sure we're not doing something with it on every keystroke, but once the user made a pause during typing. And with "useEffect", it's actually easy to implement. We can use 'setTimeout', to wait for, for example, 500 milliseconds until we execute some function. Now, in this function, we might want to check our form validity or to update our form validity. Now we would only do this after 500 milliseconds.
//? Now, the trick is that we actually save the timer. And for the next keystroke, we clear it so that we only have one ongoing timer at a time. And only the last timer will, therefore, complete. And as long as the user keeps on typing, we always clear all other timers. And therefore, we only have one timer that completes, and that completes after 500 milliseconds, which is the delay the user has to issue a new keystroke to clear this timer.
