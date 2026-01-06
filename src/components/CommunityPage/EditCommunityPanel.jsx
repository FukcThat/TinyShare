import Button from '../ui/Button';
import BgPanel from '../global/BgPanel';
import { useState } from 'react';
import TextArea from '../ui/TextArea';
import Input from '../ui/Input';
import useUpdateCommunity from '../../hooks/tanstack_mutations/useUpdateCommunity';

export default function EditCommunityPanel({ activeCommunity }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(activeCommunity.name);
  const [descInput, setDescInput] = useState(activeCommunity.description);

  const UpdateCommunity = useUpdateCommunity();

  const HandleSubmitUpdate = () => {
    if (nameInput === '') return;

    UpdateCommunity.mutate(
      {
        communityToEditId: activeCommunity.id,
        editNameInput: nameInput,
        editDescInput: descInput,
      },
      {
        onSuccess: (data) => {
          setNameInput(data.name);
          setDescInput(data.description);
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <BgPanel styles="w-full items-start">
      <div className="absolute top-4 right-4 flex gap-2">
        {isEditing && (
          <Button
            text={'Submit'}
            styles="bg-accent/60 hover:bg-accent/80"
            onClick={HandleSubmitUpdate}
            disabled={UpdateCommunity.isPending}
          />
        )}
        <Button
          text={isEditing ? 'Cancel' : '✏️ Edit'}
          onClick={() => {
            setIsEditing(!isEditing);
          }}
          styles={`${isEditing && 'bg-warning/60 hover:bg-warning/80'}`}
          disabled={UpdateCommunity.isPending}
        />
      </div>

      <h2 className="text-xl my-2">⚙️ Settings</h2>
      <div className="flex flex-col w-full">
        <h3>Community Name:</h3>
        {isEditing ? (
          <Input
            outerStyles="w-full"
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
            }}
          />
        ) : (
          <h3>{activeCommunity.name}</h3>
        )}
      </div>
      <div className="flex flex-col w-full">
        <h3>Description:</h3>
        {isEditing ? (
          <TextArea
            id="item-description"
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
          />
        ) : (
          <h3>
            {activeCommunity.description === ''
              ? '-'
              : activeCommunity.description}
          </h3>
        )}
      </div>
    </BgPanel>
  );
}
