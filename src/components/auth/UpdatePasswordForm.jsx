import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabaseClient";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function UpdatePasswordForm({ onComplete }) {
  const [passInput, setPassInput] = useState("");
  const [confirmPassInput, setconfirmPassInput] = useState("");
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);

  const SetNewPassword = async (e) => {
    e.preventDefault();

    if (
      passInput === "" ||
      confirmPassInput === "" ||
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
      <div className="text-3xl">Set Up Password</div>
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
        {err && <div className="text-sm text-red-600">{err}</div>}
      </form>
    </div>
  );
}
