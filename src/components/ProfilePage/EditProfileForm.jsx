import useUpdateUserProfile from '../../hooks/tanstack_mutations/useUpdateUserProfile';
import { useSession } from '../../context/session_context/useSession';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ConfirmIcon } from '../ui/Icons/Icons';
import { useState } from 'react';
import ErrorText from '../ui/Text/ErrorText';

export default function EditProfileForm({
  nameInput,
  setNameInput,
  setShowForm,
}) {
  const { session } = useSession();
  const userId = session?.user?.id;
  const updateProfile = useUpdateUserProfile();
  const [err, setErr] = useState(null);

  const HandleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (nameInput == '') return;
    updateProfile.mutate(
      { userId, name: nameInput },
      {
        onSuccess: () => {
          setShowForm(false);
          setErr(null);
        },
        onError: (error) => setErr(error.message),
      }
    );
  };

  return (
    <form
      onSubmit={HandleSubmitUpdate}
      className="flex flex-row items-center justify-center gap-2"
    >
      <div className="flex flex-col gap-2">
        <Input
          id="nameInput"
          value={nameInput}
          outerStyles="flex"
          inputStyles="w-[250px]"
          maxLength={50}
          onChange={(e) => setNameInput(e.target.value)}
        />
        {err && <ErrorText text={err} />}
      </div>

      <Button
        disabled={updateProfile.isPending}
        type="submit"
        text=""
        icon={<ConfirmIcon styles={'w-6'} />}
        styles="p-1 bg-primary"
      />
    </form>
  );
}
