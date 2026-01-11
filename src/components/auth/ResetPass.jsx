import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../lib/supabaseClient';
import SubContentText from '../ui/Text/SubContentText';
import FadedText from '../ui/Text/FadedText';

export default function ResetPass({ setCurState }) {
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState(null);

  const HandleResetPassword = async (e) => {
    e.preventDefault();

    if (emailInput === '') {
      setErr('Please provide an email');
      return;
    }

    try {
      setIsLoading(true);
      setErr(null);

      const res = await supabase.auth.resetPasswordForEmail(emailInput);
      if (res.error) throw new Error('Issue sending reset email!');
      setSuccess(true);
      setEmailInput('');
    } catch (error) {
      console.error(error);
      setErr('Issue sending reset email!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-primary p-10 rounded-lg m-10">
      {success ? (
        <div className="flex flex-col gap-4 items-center">
          <SubContentText text="Please check your email for further steps!" />
          <FadedText text="You can close this window" />
        </div>
      ) : (
        <>
          <form
            onSubmit={HandleResetPassword}
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
            <Button
              type="submit"
              text="Recover Email"
              disabled={isLoading}
              styles="hover:bg-green-400/50"
            />
            {err && (
              <SubContentText
                text="Issue with recovery process, try again later."
                styles="text-text-warning"
              />
            )}
          </form>
          <Button
            onClick={() => setCurState(0)}
            text="Already have an account? Sign-In!"
          />
        </>
      )}
    </div>
  );
}
