import Button from '../ui/Button';
import { CancelIcon } from '../ui/Icons/Icons';

export default function ErrorModal({
  setShow = () => {},
  errorMessage = 'ERR',
}) {
  return (
    errorMessage != null && (
      <div>
        <Button onClick={setShow} text="" icon={<CancelIcon />} />
        <h2>{errorMessage}</h2>
      </div>
    )
  );
}
