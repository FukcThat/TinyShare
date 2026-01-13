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
import {
  CancelIcon,
  DarkModeIcon,
  EditIcon,
  LightModeIcon,
  LogoutIcon,
} from '../ui/Icons/Icons';

const oneDay = 24 * 60 * 60 * 1000;

export default function ProfileHeader({ yourItems }) {
  const { userProfile } = useGlobal();
  const [showForm, setShowForm] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (userProfile.isPending) return;
    setNameInput(userProfile.data.name);
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
    return userProfile.isPending
      ? 0
      : Math.floor(
          (Date.now() - new Date(userProfile.data.created_at)) / oneDay
        );
  }, [userProfile]);

  const totalItems = useMemo(() => {
    return yourItems.isPending ? 0 : yourItems.data.length;
  }, [yourItems]);

  const availableItems = useMemo(() => {
    return yourItems.isPending
      ? 0
      : yourItems.data.filter((item) => item.is_available).length;
  }, [yourItems]);

  const ToggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  };

  return (
    <BgPanel>
      {userProfile.isPending ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between w-full border-b border-accent/50 ">
            {
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {showForm ? (
                    <EditProfileForm
                      nameInput={nameInput}
                      setShowForm={setShowForm}
                      setNameInput={setNameInput}
                    />
                  ) : (
                    <HeaderText styles="w-fit" text={userProfile.data.name} />
                  )}
                  <Button
                    onClick={() => {
                      setShowForm(!showForm);
                      setNameInput(userProfile.data.name);
                    }}
                    styles="bg-primary p-1"
                    text={showForm ? '' : ''}
                    icon={
                      showForm ? (
                        <CancelIcon styles={'w-6'} />
                      ) : (
                        <EditIcon styles={'w-6'} />
                      )
                    }
                  />
                </div>
                <FadedText text={userProfile.data.email} />
              </div>
            }
            <div className="flex  gap-2">
              <Button
                styles="items-center h-fit"
                onClick={ToggleTheme}
                text=""
                icon={
                  !isDarkMode ? (
                    <DarkModeIcon styles={'w-6'} />
                  ) : (
                    <LightModeIcon styles={'w-6'} />
                  )
                }
                iconPos="center"
              />
              <Button
                styles="bg-warning/60 hover:bg-warning/80 items-center h-fit"
                onClick={HandleLogOut}
                text="Logout"
                icon={<LogoutIcon />}
                iconPos="right"
              />
            </div>
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
        </>
      )}
    </BgPanel>
  );
}
