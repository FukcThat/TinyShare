import { useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabaseClient';
import Button from '../ui/Button';
import Input from '../ui/Input';
import HeaderText from '../ui/Text/HeaderText';
import SubContentText from '../ui/Text/SubContentText';

export default function UpdatePasswordForm({ onComplete }) {
  const [passInput, setPassInput] = useState('');
  const [confirmPassInput, setconfirmPassInput] = useState('');
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);

  const SetNewPassword = async (e) => {
    e.preventDefault();

    if (
      passInput === '' ||
      confirmPassInput === '' ||
      passInput != confirmPassInput
    )
      return;

    try {
      setErr(null);
      setIsLoading(true);
      await supabase.auth.updateUser({ password: passInput });
      onComplete();
      nav(0);
    } catch (error) {
      console.error(error);
      setErr(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-10">
      <HeaderText text="Set Up Password" />
      <form onSubmit={SetNewPassword} className="flex flex-col gap-5 ">
        <Input
          id="password"
          labelText="Password:"
          withLabel
          placeholder="Enter new password..."
          required
          labelStyles="w-[100px]"
          inputStyles="w-[250px]"
          type="password"
          value={passInput}
          onChange={(e) => setPassInput(e.target.value)}
        />
        <Input
          id="confirmPassword"
          labelText="Confirm Password:"
          withLabel
          placeholder="Confirm your password..."
          required
          labelStyles="w-[100px]"
          inputStyles="w-[250px]"
          type="password"
          value={confirmPassInput}
          onChange={(e) => setconfirmPassInput(e.target.value)}
        />
        <Button type="submit" text="Update Password" disabled={isLoading} />
        {err && <SubContentText text={err} styles="text-text-warning" />}
      </form>
    </div>
  );
}
