import React from 'react';
import { useNavigate } from 'react-router';
import { NotificationType } from '../../lib/NotificationType';
import useDimissNotification from '../../hooks/tanstack_mutations/useDismissNotification';
import SubContentText from '../ui/Text/SubContentText';
import ContentText from '../ui/Text/ContentText';
import SubFadedText from '../ui/Text/SubFadedText';
import Button from '../ui/Button';
import { LinkIcon } from '../ui/Icons/Icons';

export default function NotificationModal({
  showNotificationModal,
  sortedNotifications,
}) {
  const nav = useNavigate();
  const DismissNotification = useDimissNotification();
  const HandleDismissNotificaion = (notification_id) => {
    DismissNotification.mutate(
      { notification_id },
      {
        onSuccess: () => {},
        onError: (error) => console.log(error.message),
      },
    );
  };

  return (
    <div
      className={`
            absolute top-28 
            right-auto md:right-10 
            md:top-14 z-50 bg-secondary 
            w-[400px] 
            rounded-md border-white 
            border flex flex-col p-4 
            items-center gap-4
            overflow-auto
            ${showNotificationModal ? 'h-[300px]' : 'h-0'}
          `}
    >
      <ContentText text="Notifications" styles="w-full text-center text-xl" />
      {sortedNotifications.length === 0 ? (
        <SubContentText text="-" styles="w-full text-center" />
      ) : (
        <div className="flex flex-col w-full gap-4">
          {sortedNotifications.map((notification) => {
            return (
              <div
                key={notification.id}
                className={`
                      flex flex-col w-full hover:border-accent/60 border border-accent/40 rounded-md p-2 active:border-accent cursor-pointer relative
                      ${notification.type === NotificationType.error && 'bg-warning/40'}
                      ${notification.type === NotificationType.info && 'bg-accent/40'}
                      ${notification.type === NotificationType.warning && 'bg-yellow-600/40'}`}
              >
                <SubContentText text={notification.body} />
                <SubFadedText
                  text={new Date(notification.created_at).toLocaleString()}
                />
                <div className="flex gap-2 my-2 w-full items-center justify-around ">
                  <Button
                    onClick={() => HandleDismissNotificaion(notification.id)}
                    text="X"
                    disabled={
                      DismissNotification.isPending ||
                      DismissNotification.isError
                    }
                    styles="bg-warning/60 hover:bg-warning/100 active:bg-warning/80 absolute -top-2.5 -right-2.5 px-1.5 py-0 rounded-full"
                  />
                  {notification.link != null && (
                    <Button
                      icon={<LinkIcon styles={'hover:scale-100'} />}
                      iconPos="right"
                      text="Info"
                      styles="bg-accent/60 hover:bg-accent/100 active:bg-accent/80"
                      onClick={() => nav(notification.link)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
