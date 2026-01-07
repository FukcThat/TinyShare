import BgPanel from '../global/BgPanel';
import useActiveBooking from '../../hooks/useActiveBooking';
import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useDeleteItem from '../../hooks/tanstack_mutations/useDeleteItem';
import useUpdateItem from '../../hooks/tanstack_mutations/useUpdateItem';
import { useNavigate } from 'react-router';
import TextArea from '../ui/TextArea';
import Checkbox from '../ui/Checkbox';

export default function ItemInfoPanel({ item }) {
  const { isBooked } = useActiveBooking(item);
  const nav = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const DeleteItem = useDeleteItem();
  const UpdateItem = useUpdateItem();
  const [formData, setFormData] = useState({
    name: item.name,
    isAvailable: item.is_available,
    description: item.description,
    imgFile: null,
    imgPreview: item.image_url,
  });

  const ResetFormState = (data) => {
    setFormData({
      name: data.name,
      isAvailable: data.is_available,
      description: data.description,
      imgFile: null,
      imgPreview: data.image_url,
    });
    setIsEditing(false);
  };

  const HandleUpdateItem = async (e) => {
    e.preventDefault();
    if (formData.name === '') return;

    UpdateItem.mutate(
      {
        item_id: item.id,
        name: formData.name,
        is_available: formData.isAvailable,
        description: formData.description,
        newFile: formData.imgFile,
        oldImageUrl: item.image_url,
        owner: item.owner.id,
      },
      {
        onError: (msg) => console.log(msg),
        onSuccess: (data) => {
          ResetFormState(data);
        },
      }
    );
  };

  const HandleDeleteItem = async () => {
    DeleteItem.mutate(
      {
        item_id: item.id,
        image_url: item.image_url,
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
          <div className="flex flex-col lg:flex-row gap-4 items-center  w-full">
            <input
              id="img-picker"
              type="file"
              multiple={false}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setFormData((prev) => ({
                  ...prev,
                  imgFile: file,
                  imgPreview: URL.createObjectURL(file),
                }));
              }}
            />
            <label
              className="h-24 w-24 border rounded-md border-green-400 cursor-pointer overflow-hidden"
              htmlFor="img-picker"
            >
              <img
                src={formData.imgPreview}
                className="h-full w-auto object-cover"
                alt="item-img"
              />{' '}
            </label>
            <Input
              disabled={UpdateItem.isPending || DeleteItem.isPending}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              inputStyles="border text-start text-2xl focus:border-accent"
              value={formData.name}
            />
            <Checkbox
              disabled={UpdateItem.isPending || DeleteItem.isPending}
              id="is_available_item"
              labelText="Available"
              onChange={() =>
                setFormData({
                  ...formData,
                  isAvailable: !formData.isAvailable,
                })
              }
              value={formData.isAvailable}
            />
          </div>
        ) : (
          <div className="flex gap-4 items-center w-full  ">
            <div className="h-24 w-24 rounded-md overflow-hidden">
              <img
                src={item.image_url}
                className="h-full w-auto object-cover"
                alt="item-img"
              />
            </div>
            <div className="text-2xl border border-transparent px-2 w-[calc(100%-6rem)]">
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
                onClick={() => ResetFormState(item)}
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
        {isEditing ? (
          <TextArea
            disabled={UpdateItem.isPending || DeleteItem.isPending}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        ) : (
          <div>{item.description}</div>
        )}
      </div>
      <div>Owner: {item.owner.name}</div>
    </BgPanel>
  );
}
