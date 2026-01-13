import Button from '../ui/Button';
import ItemView from '../global/ItemView';
import { useState } from 'react';
import BgPanel from '../global/BgPanel';
import HeaderText from '../ui/Text/HeaderText';
import NewItemForm from './NewItemForm';
import Loading from '../global/Loading';

export default function UserItemsPanel({ items }) {
  const [isOpen, setIsOpen] = useState(false);

  const ToggleItemForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <BgPanel>
      <div className="flex flex-col justify-between w-full gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-center">
          <HeaderText text="My Items" styles="w-fit" />
          <Button
            text="+ Add Item"
            styles="bg-primary"
            onClick={ToggleItemForm}
            disabled={items.isPending}
          />
        </div>
        {isOpen && <NewItemForm setIsOpen={setIsOpen} />}
        {items.isPending ? (
          <Loading />
        ) : (
          <div className="grid grid-flow-row lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {items.data.map((item) => (
              <ItemView key={item.id} item={item} isOwner />
            ))}
          </div>
        )}
      </div>
    </BgPanel>
  );
}
