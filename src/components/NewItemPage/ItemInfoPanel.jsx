import BgPanel from '../global/BgPanel';
import useActiveBooking from '../../hooks/useActiveBooking';
import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useDeleteItem from '../../hooks/tanstack_mutations/useDeleteItem';
import useUpdateItem from '../../hooks/tanstack_mutations/useUpdateItem';
import { useNavigate } from 'react-router';

export default function ItemInfoPanel({ item }) {
  const { isBooked } = useActiveBooking(item);
  const nav = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const DeleteItem = useDeleteItem();
  const UpdateItem = useUpdateItem();
  const [formData, setFormData] = useState({
    name: item.name,
    isAvailable: item.is_available,
  });

  const HandleUpdateItem = async (e) => {
    e.preventDefault();

    if (formData.name === '') return;

    UpdateItem.mutate(
      {
        item_id: item.id,
        name: formData.name,
        is_available: formData.isAvailable,
      },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const HandleDeleteItem = async () => {
    DeleteItem.mutate(
      {
        item_id: item.id,
      },
      {
        onSuccess: () => {
          nav('/');
        },
      }
    );
  };

  return (
    <BgPanel>
      <div className="flex flex-col-reverse gap-4 md:flex-row w-full md:justify-between ">
        {isEditing ? (
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="h-24 w-24 border rounded-md border-green-400">
              <img src="" className="cover" alt="item-img" />
            </div>
            <Input
              disabled={UpdateItem.isPending || DeleteItem.isPending}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              inputStyles="border text-start text-2xl focus:border-accent"
              value={formData.name}
            />
            <Input
              withLabel
              id="is_available_item"
              type="checkbox"
              labelText="Available"
              labelStyles={`${
                formData.isAvailable ? 'text-white' : 'text-warning'
              }`}
              inputStyles="h-6 w-6 accent-accent"
              disabled={UpdateItem.isPending || DeleteItem.isPending}
              onChange={() =>
                setFormData({ ...formData, isAvailable: !formData.isAvailable })
              }
              value={formData.isAvailable}
            />
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <div className="h-24 w-24 border rounded-md">
              <img src="" className="cover" alt="item-img" />
            </div>
            <div className="text-2xl border border-transparent px-2">
              {item.name}
            </div>
          </div>
        )}
        <div className="flex gap-4 w-full justify-center md:justify-end">
          {!isEditing ? (
            <Button
              disabled={UpdateItem.isPending || DeleteItem.isPending}
              onClick={() => setIsEditing(!isEditing)}
              text="✏️"
              styles="h-10"
            />
          ) : (
            <div className="flex gap-2">
              <Button
                disabled={UpdateItem.isPending || DeleteItem.isPending}
                onClick={HandleDeleteItem}
                text="🗑️"
                styles="h-10 bg-warning"
              />
              <Button
                disabled={UpdateItem.isPending || DeleteItem.isPending}
                onClick={HandleUpdateItem}
                text="✔️"
                styles="h-10"
              />
              <Button
                disabled={UpdateItem.isPending || DeleteItem.isPending}
                onClick={() => {
                  setFormData({
                    name: item.name,
                    isAvailable: item.is_available,
                  });
                  setIsEditing(false);
                }}
                text="❌"
                styles="h-10"
              />
            </div>
          )}

          <div
            className={`px-4 py-1 rounded-sm h-10 items-center flex ${
              isBooked || !item.is_available
                ? 'bg-warning/50'
                : 'bg-emerald-700'
            }`}
          >
            {!item.is_available
              ? 'Not Available'
              : isBooked
              ? 'Currently Booked'
              : 'Available'}
          </div>
        </div>
      </div>
      <div className="text-start w-full text-lg font-bold">Description</div>
      <div className="w-full text-wrap border-b border-b-accent pb-4">
        This is an item that does this and that and its the best! This is an
        item that does this and that and its the best! This is an item that does
        this and that and its the best!
      </div>
      <div>Owner: {item.owner.name}</div>
    </BgPanel>
  );
}
