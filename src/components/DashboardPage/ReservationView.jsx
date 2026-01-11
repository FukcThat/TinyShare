import { Link } from 'react-router';
import SubContentText from '../ui/Text/SubContentText';
import FadedText from '../ui/Text/FadedText';
import ContentText from '../ui/Text/ContentText';
import { useMemo } from 'react';

export default function ReservationView({ res, isActiveRes = false }) {
  const todayDateString = new Date().toLocaleDateString();

  const { endDateString, endTimeString, startDateString, startTimeString } =
    useMemo(() => {
      return {
        endDateString: new Date(res.end).toLocaleDateString(),
        endTimeString: new Date(res.end).toLocaleTimeString(),
        startDateString: new Date(res.start).toLocaleDateString(),
        startTimeString: new Date(res.start).toLocaleTimeString(),
      };
    }, [res]);

  return (
    <Link
      to={`/items/${res.item.id}`}
      className="border border-accent/40 hover:border-accent/60 p-2 rounded-md"
      key={res.id}
    >
      <ContentText text={res.item.name} />
      <FadedText
        styles="truncate"
        text={`${res.item.description || '-'} | Owner: ${res.user.name}`}
      />

      {isActiveRes &&
        (endDateString === todayDateString ? (
          <SubContentText text={`Booking Ends Today at ${endTimeString}`} />
        ) : (
          <SubContentText
            text={`Booking Ends at ${endTimeString} on the ${endDateString}`}
          />
        ))}

      {!isActiveRes &&
        (startDateString === todayDateString ? (
          <SubContentText text={`Booking Starts Today at ${startTimeString}`} />
        ) : (
          <SubContentText
            text={`Booking Starts at ${startTimeString} on the ${startDateString}`}
          />
        ))}
    </Link>
  );
}
