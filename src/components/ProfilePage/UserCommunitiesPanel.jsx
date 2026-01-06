import { useState } from 'react';
import useCreateCommunity from '../../hooks/tanstack_mutations/useCreateCommunity';
import { useSession } from '../../context/session_context/useSession';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useUserCommunities from '../../hooks/tanstack_queries/useUserCommunities';
import { useGlobal } from '../../context/useGlobal';
import InvitationPanel from '../membership/InvitationPanel';
import BgPanel from '../global/BgPanel';
import TextArea from '../ui/TextArea';

export default function UserCommunitiesPanel() {
  const { session } = useSession();
  const { activeCommunity, setActiveCommunity } = useGlobal();

  const { data: userCommunities } = useUserCommunities();
  const [showForm, setShowForm] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

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
        },
      }
    );
  };

  const HandleSelectActiveCommunity = (e) => {
    if (e.id === activeCommunity.id) return;
    // when we change the data here, we want to update local storage
    setActiveCommunity(
      userCommunities.find((community) => {
        return community.id == e.id;
      })
    );
    localStorage.setItem('tiny-share-active-community-id', e.id);
  };

  return (
    <BgPanel>
      <div className=" flex flex-col gap-4 items-center md:flex-row w-full justify-between">
        <div className="text-center md:text-start w-full text-2xl">
          My Communities
        </div>

        <div>
          <Button
            text="+ Create Community"
            onClick={() => {
              setNameInput('');
              setShowForm(!showForm);
            }}
            styles="w-[200px] bg-primary"
          />
        </div>
      </div>
      {showForm && (
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
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-2">
        {userCommunities?.map((e) => {
          return (
            <div
              onClick={() => HandleSelectActiveCommunity(e)}
              key={e.id}
              className={`cursor-pointer grid grid-cols-2 items-center bg-primary border  hover:border-white w-full h-20 rounded-md ${
                e.role == 'admin' ? ' border-accent' : 'border-transparent'
              }`}
            >
              <div className="text-center">{e.name}</div>
              <div className="text-center">
                {activeCommunity?.id === e.id ? '✔️' : '❌'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-2">
        <InvitationPanel />
      </div>
    </BgPanel>
  );
}
