import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../lib/supabaseClient';
import SubContentText from '../ui/Text/SubContentText';

export default function SignIn({ setCurState }) {
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const HandleSignIn = async (e) => {
    e.preventDefault();

    if (emailInput === '' || passInput === '') {
      setErr('Please provide an email AND a password');
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passInput,
      });

      if (error) {
        throw new Error('Issue Signing In', error);
      }

      setEmailInput('');
      setPassInput('');
    } catch (error) {
      setErr('Issue Signing In');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-900/60 p-10 rounded-lg m-10">
      <form
        onSubmit={HandleSignIn}
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
        <SubContentText text={err && err} styles="text-text-warning h-6" />
        <Button
          type="submit"
          text="Sign In"
          disabled={isLoading}
          styles="hover:bg-green-400/50"
        />
      </form>
      <Button onClick={() => setCurState(2)} text="Forgot your password?" />
      <Button onClick={() => setCurState(1)} text="No account yet? Sign up!" />
    </div>
  );
}
