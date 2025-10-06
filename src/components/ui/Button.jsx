import React from 'react';

export default function Button({ text = 'Button TEST', onClick = () => {} }) {
  return (
    <button
      onClick={onClick}
      className=" bg-slate-600 px-4 py-2 rounded-md hover:bg-slate-500 cursor-pointer"
    >
      {text}
    </button>
  );
}
