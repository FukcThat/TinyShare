import {
  BiCalendarExclamation,
  BiCalendarEvent,
  BiSearchAlt,
  BiRevision,
  BiEditAlt,
  BiX,
  BiCheckDouble,
  BiTrash,
  BiCalendarAlt,
  BiLogOutCircle,
  BiLogOut,
  BiMailSend,
  BiUserPlus,
  BiShieldQuarter,
  BiCog,
  BiImageAdd,
  BiUserPin,
  BiHomeCircle,
  BiHomeAlt2,
  BiMoon,
  BiSun,
  BiCalendarCheck,
  BiCalendarEdit,
  BiBarChartSquare,
  BiHomeAlt,
  BiBell,
  BiUserCircle,
  BiLinkExternal,
} from 'react-icons/bi';
import { twMerge } from 'tailwind-merge';

const defaultIconStyle =
  'h-auto w-8 text-text-primary transition-all duration-75 hover:scale-105';

export function DashboardNavIcon({ styles }) {
  return <BiBarChartSquare className={twMerge([defaultIconStyle, styles])} />;
}

export function LinkIcon({ styles }) {
  return <BiLinkExternal className={twMerge([defaultIconStyle, styles])} />;
}

export function CommunityNavIcon({ styles }) {
  return <BiHomeAlt className={twMerge([defaultIconStyle, styles])} />;
}

export function ProfileNavIcon({ styles }) {
  return <BiUserCircle className={twMerge([defaultIconStyle, styles])} />;
}

export function NotificationNavIcon({ styles }) {
  return <BiBell className={twMerge([defaultIconStyle, styles])} />;
}

export function DarkModeIcon({ styles }) {
  return <BiMoon className={twMerge([defaultIconStyle, styles])} />;
}

export function LightModeIcon({ styles }) {
  return <BiSun className={twMerge([defaultIconStyle, styles])} />;
}

export function ActiveCommunityIcon({ styles }) {
  return <BiHomeCircle className={twMerge([defaultIconStyle, styles])} />;
}

export function InactiveCommunityIcon({ styles }) {
  return <BiHomeAlt2 className={twMerge([defaultIconStyle, styles])} />;
}

export function CurrentlyBookedUserItemsIcon({ styles }) {
  return <BiUserPin className={twMerge([defaultIconStyle, styles])} />;
}

export function LeaveIcon({ styles }) {
  return <BiLogOutCircle className={twMerge([defaultIconStyle, styles])} />;
}

export function NewInviteIcon({ styles }) {
  return <BiUserPlus className={twMerge([defaultIconStyle, styles])} />;
}

export function SendInviteIcon({ styles }) {
  return <BiMailSend className={twMerge([defaultIconStyle, styles])} />;
}

export function AdminShieldIcon({ styles }) {
  return <BiShieldQuarter className={twMerge([defaultIconStyle, styles])} />;
}

export function SettingsIcon({ styles }) {
  return <BiCog className={twMerge([defaultIconStyle, styles])} />;
}

export function LogoutIcon({ styles }) {
  return <BiLogOut className={twMerge([defaultIconStyle, styles])} />;
}

export function ImageBrowseIcon({ styles }) {
  return <BiImageAdd className={twMerge([defaultIconStyle, styles])} />;
}

export function ResetIcon({ styles }) {
  return <BiRevision className={twMerge([defaultIconStyle, styles])} />;
}

export function EditIcon({ styles }) {
  return <BiEditAlt className={twMerge([defaultIconStyle, styles])} />;
}

export function CancelIcon({ styles }) {
  return <BiX className={twMerge([defaultIconStyle, styles])} />;
}

export function ConfirmIcon({ styles }) {
  return <BiCheckDouble className={twMerge([defaultIconStyle, styles])} />;
}

export function DeleteIcon({ styles }) {
  return <BiTrash className={twMerge([defaultIconStyle, styles])} />;
}

export function CalendarIcon({ styles }) {
  return <BiCalendarAlt className={twMerge([defaultIconStyle, styles])} />;
}

export function ActiveBookingIcon({ styles }) {
  return (
    <BiCalendarExclamation className={twMerge([defaultIconStyle, styles])} />
  );
}

export function PendingRequestIcon({ styles }) {
  return <BiCalendarEdit className={twMerge([defaultIconStyle, styles])} />;
}

export function UpcomingBookingIcon({ styles }) {
  return <BiCalendarCheck className={twMerge([defaultIconStyle, styles])} />;
}

export function SearchIcon({ styles }) {
  return <BiSearchAlt className={twMerge([defaultIconStyle, styles])} />;
}
