import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../lib/supabaseClient';
import SubContentText from '../ui/Text/SubContentText';
import FadedText from '../ui/Text/FadedText';

export default function SignUp({ setCurState }) {
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const HandleSignUp = async (e) => {
    e.preventDefault();

    if (emailInput === '' || passInput === '') {
      setErr('Please provide an email AND a password');
      return;
    }

    try {
      setIsLoading(true);
      console.log(passInput);
      const { error } = await supabase.auth.signUp({
        email: emailInput,
        password: passInput,
      });

      if (error) {
        throw new Error('Issue Signing Up', error);
      }

      setSuccess(true);
      setEmailInput('');
      setPassInput('');
    } catch (error) {
      setErr('Issue Signing In');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-900/60 p-10 rounded-lg m-10">
      {success ? (
        <div className="flex flex-col items-center gap-2">
          <SubContentText text="Please check your email to complete the sign up!" />
          <FadedText text="You can close this page" />
        </div>
      ) : (
        <>
          <form
            onSubmit={HandleSignUp}
            className="flex flex-col gap-4 my-10  items-center"
          >
            <Input
              id="email"
              labelText="E-Mail:"
              withLabel
              placeholder="Enter your email..."
              required
              value={emailInput}
              labelStyles="w-[100px]"
              inputStyles="w-[250px]"
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <Input
              id="password"
              labelText="Password:"
              withLabel
              placeholder="Enter your password..."
              required
              labelStyles="w-[100px]"
              inputStyles="w-[250px]"
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
            />
            <SubContentText text={err && err} styles="h-6 text-text-warning" />
            <Button
              type="submit"
              text="Sign Up"
              disabled={isLoading}
              styles="hover:bg-green-400/50"
            />
          </form>
          <Button
            onClick={() => setCurState(0)}
            text="Already have an account? Sign in!"
          />
        </>
      )}
    </div>
  );
}
