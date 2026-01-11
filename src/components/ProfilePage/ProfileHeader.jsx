import { useEffect, useMemo, useState } from 'react';
import Button from '../ui/Button';
import EditProfileForm from './EditProfileForm';
import Loading from '../global/Loading';
import BgPanel from '../global/BgPanel';
import HeaderText from '../ui/Text/HeaderText';
import FadedText from '../ui/Text/FadedText';
import SubContentText from '../ui/Text/SubContentText';
import ContentText from '../ui/Text/ContentText';
import { useGlobal } from '../../context/useGlobal';
import { supabase } from '../../lib/supabaseClient';

const oneDay = 24 * 60 * 60 * 1000;

export default function ProfileHeader({ yourItems }) {
  const { userProfile } = useGlobal();
  const [showForm, setShowForm] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    if (!userProfile) return;
    setNameInput(userProfile.name);
  }, [userProfile]);

  const HandleLogOut = async () => {
    try {
      let { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(error);
    }
  };

  const accountAge = useMemo(() => {
    return (
      Math.floor((Date.now() - new Date(userProfile?.created_at)) / oneDay) || 0
    );
  }, [userProfile]);

  const totalItems = useMemo(() => {
    return yourItems?.length || 0;
  }, [yourItems]);

  const availableItems = useMemo(() => {
    return yourItems?.filter((item) => item.is_available).length || 0;
  }, [yourItems]);

  if (!userProfile) return <Loading />;

  return (
    <BgPanel>
      <div className="flex justify-between w-full border-b border-accent/50 ">
        {userProfile && userProfile.name != '' ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {showForm ? (
                <EditProfileForm
                  nameInput={nameInput}
                  setShowForm={setShowForm}
                  setNameInput={setNameInput}
                />
              ) : (
                <HeaderText text={userProfile.name} />
              )}
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  setNameInput(userProfile.name);
                }}
                styles="bg-primary p-1"
                text={showForm ? '❌' : '✏️'}
              />
            </div>
            <FadedText text={userProfile.email} />
          </div>
        ) : (
          <SubContentText text={userProfile.email} />
        )}
        <Button
          styles="bg-warning/60 hover:bg-warning"
          onClick={HandleLogOut}
          text="Logout"
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row justify-between w-full ">
        {[
          ['Account Age: ', accountAge + ' Days'],
          ['Total Items: ', totalItems],
          ['Available Items: ', availableItems],
        ].map((e) => {
          return (
            <div key={e[0]}>
              <FadedText text={e[0]} />
              <ContentText text={e[1]} />
            </div>
          );
        })}
      </div>
    </BgPanel>
  );
}
