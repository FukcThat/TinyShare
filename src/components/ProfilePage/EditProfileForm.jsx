import useUpdateUserProfile from "../../hooks/tanstack_mutations/useUpdateUserProfile";
import { useSession } from "../../context/session_context/useSession";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function EditProfileForm({
  nameInput,
  setNameInput,
  setShowForm,
}) {
  const { session } = useSession();
  const userId = session?.user?.id;
  const updateProfile = useUpdateUserProfile();

  const HandleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (nameInput == "") return;
    updateProfile.mutate(
      { userId, name: nameInput },
      {
        onSuccess: () => {
          setShowForm(false);
        },
      }
    );
  };

  return (
    <form
      onSubmit={HandleSubmitUpdate}
      className="flex flex-row items-center justify-center gap-2"
    >
      <Input
        id="nameInput"
        value={nameInput}
        outerStyles="flex"
        inputStyles="border-2 px-2 border-slate-200 rounded-md focus:border-green-400 py-0 text-start w-32"
        onChange={(e) => setNameInput(e.target.value)}
      />
      <Button
        disabled={updateProfile.isPending}
        type="submit"
        text="✔️"
        styles="p-1 bg-primary"
      />
    </form>
  );
}
