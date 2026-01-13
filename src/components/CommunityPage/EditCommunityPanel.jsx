import Button from '../ui/Button';
import BgPanel from '../global/BgPanel';
import { useState } from 'react';
import TextArea from '../ui/TextArea';
import Input from '../ui/Input';
import useUpdateCommunity from '../../hooks/tanstack_mutations/useUpdateCommunity';
import SubHeaderText from '../ui/Text/SubHeaderText';
import SubContentText from '../ui/Text/SubContentText';
import {
  CancelIcon,
  ConfirmIcon,
  EditIcon,
  SettingsIcon,
} from '../ui/Icons/Icons';
import { useGlobal } from '../../context/useGlobal';
import Loading from '../global/Loading';

export default function EditCommunityPanel({ activeCommunity }) {
  const { userCommunities } = useGlobal();
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
            text={''}
            icon={<ConfirmIcon styles={'hover:scale-100 w-6'} />}
            styles="bg-accent/60 hover:bg-accent/80"
            onClick={HandleSubmitUpdate}
            disabled={UpdateCommunity.isPending || userCommunities.isPending}
          />
        )}
        <Button
          text={''}
          icon={
            isEditing ? (
              <CancelIcon styles={'hover:scale-100 w-6'} />
            ) : (
              <EditIcon styles={'hover:scale-100 w-6'} />
            )
          }
          onClick={() => {
            setIsEditing(!isEditing);
          }}
          styles={`${isEditing && 'bg-warning/60 hover:bg-warning/80'}`}
          disabled={UpdateCommunity.isPending || userCommunities.isPending}
        />
      </div>
      <div className="flex gap-2 w-full items-center">
        <SettingsIcon styles={'w-6'} />
        <SubHeaderText text={'Settings'} />
      </div>
      {userCommunities.isPending ? (
        <Loading />
      ) : (
        <>
          {' '}
          <div className="flex flex-col w-full">
            <SubContentText text="Community Name:" />
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
              <SubContentText text={activeCommunity.name} />
            )}
          </div>
          <div className="flex flex-col w-full">
            <SubContentText text="Description:" />
            {isEditing ? (
              <TextArea
                id="item-description"
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
              />
            ) : (
              <SubContentText text={activeCommunity.description || '-'} />
            )}
          </div>
        </>
      )}
    </BgPanel>
  );
}
