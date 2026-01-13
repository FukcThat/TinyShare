import { useState } from 'react';
import Button from '../ui/Button';
import { useGlobal } from '../../context/useGlobal';
import BgPanel from '../global/BgPanel';
import InvitationPanel from './InvitationPanel';
import HeaderText from '../ui/Text/HeaderText';
import SubContentText from '../ui/Text/SubContentText';
import NewCommunityForm from './NewCommunityForm';
import { ActiveCommunityIcon, InactiveCommunityIcon } from '../ui/Icons/Icons';
import Loading from '../global/Loading';

export default function UserCommunitiesPanel() {
  const { activeCommunity, setActiveCommunity, userCommunities } = useGlobal();

  const [showForm, setShowForm] = useState(false);

  const HandleSelectActiveCommunity = (e) => {
    if (e.id === activeCommunity.id || userCommunities.isPending) return;
    setActiveCommunity(
      userCommunities.data.find((community) => {
        return community.id == e.id;
      })
    );
    localStorage.setItem('tiny-share-active-community-id', e.id);
  };

  return (
    <BgPanel>
      <div className=" flex flex-col gap-4 items-center md:flex-row w-full justify-between">
        <HeaderText text="My Communities" styles="text-center md:text-start" />
        <div>
          <Button
            text="+ Create Community"
            onClick={() => {
              setShowForm(!showForm);
            }}
            styles="w-[200px] bg-primary"
            disabled={userCommunities.isPending}
          />
        </div>
      </div>
      {showForm && <NewCommunityForm setShowForm={setShowForm} />}

      {userCommunities.isPending ? (
        <Loading />
      ) : (
        <>
          <InvitationPanel />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-2">
            {userCommunities.data.map((e) => {
              return (
                <div
                  onClick={() => HandleSelectActiveCommunity(e)}
                  key={e.id}
                  className={`cursor-pointer justify-around flex gap-10 items-center bg-primary border  hover:border-white w-full h-20 rounded-md ${
                    e.role == 'admin' ? ' border-accent' : 'border-transparent'
                  }`}
                >
                  <SubContentText text={e.name} styles="w-fit" />
                  {activeCommunity?.id === e.id ? (
                    <ActiveCommunityIcon styles={'text-accent'} />
                  ) : (
                    <InactiveCommunityIcon styles={'text-warning/40'} />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </BgPanel>
  );
}
