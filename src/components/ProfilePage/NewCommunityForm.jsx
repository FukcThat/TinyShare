import { useState } from 'react';
import { useSession } from '../../context/session_context/useSession';
import useCreateCommunity from '../../hooks/tanstack_mutations/useCreateCommunity';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import ErrorText from '../ui/Text/ErrorText';

export default function NewCommunityForm({ setShowForm }) {
  const { session } = useSession();

  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  const [err, setErr] = useState(null);
  const CreateCommunity = useCreateCommunity();

  const createNewCommunity = (e) => {
    e.preventDefault();

    if (!nameInput) {
      window.alert('Please provide a name for the community :) ');
      return;
    }

    CreateCommunity.mutate(
      {
        nameInput,
        descriptionInput,
        user_id: session.user.id,
        role: 'admin',
      },
      {
        onSuccess: () => {
          setNameInput('');
          setDescriptionInput('');
          setShowForm(false);
          setErr(null);
        },
        onError: (error) => {
          setErr(error.message);
        },
      }
    );
  };
  return (
    <form
      onSubmit={createNewCommunity}
      className="flex flex-col items-center gap-6 w-full bg-primary p-2 rounded-md"
    >
      <Input
        withLabel
        outerStyles="w-full flex flex-col md:grid md:grid-cols-2"
        labelText="Name"
        labelStyles="m-0 md:ml-4"
        type="text"
        id="community_name"
        value={nameInput}
        onChange={(e) => {
          setNameInput(e.target.value);
        }}
      />
      <div className="w-full flex flex-col md:grid md:grid-cols-2">
        <label
          htmlFor="item-description"
          className="m-0 md:ml-4 text-lg cursor-pointer"
        >
          Description
        </label>
        <TextArea
          id="item-description"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
        />
      </div>

      <div className="flex w-full justify-around">
        <Button
          disabled={CreateCommunity.isPending}
          type="submit"
          text="Done!"
          styles="bg-accent/80 hover:bg-accent"
        />
        <Button
          disabled={CreateCommunity.isPending}
          type="button"
          text="Cancel"
          styles="bg-warning/80 hover:bg-warning"
          onClick={() => setShowForm(false)}
        />
      </div>
      {err && <ErrorText text={err} />}
    </form>
  );
}
