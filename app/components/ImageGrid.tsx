// components/ImageGrid.tsx
"use client";

import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function ImageGrid({
  images,
  setImages,
}: {
  images: string[];
  setImages: (imgs: string[]) => void;
}) {

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img === active.id);
      const newIndex = images.findIndex((img) => img === over.id);
      setImages(arrayMove(images, oldIndex, newIndex));
    }
  };

  const handleRemove = (index: number) => {
    console.log(`Removing image at index: ${index}`);
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={images}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <SortableImage
              key={img}
              url={img}
              index={index}
              onRemove={() => {
                console.log("Image remove clicked, index: ", index);
                handleRemove(index); // Call onRemove
              }}
              onMarkMain={() => {
                const newImages = [...images];
                const [selected] = newImages.splice(index, 1);
                setImages([selected, ...newImages]);
              }}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableImage({
  url,
  index,
  onRemove,
  onMarkMain,
}: {
  url: string;
  index: number;
  onRemove: () => void;
  onMarkMain: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group"
    >
      <img
        src={url}
        alt={`Uploaded ${index + 1}`}
        className="h-32 w-full object-cover rounded-md border-2 border-indigo-500/0 group-hover:border-indigo-500 transition"
      />
      <div className="absolute top-1 left-1 bg-white bg-opacity-80 text-xs px-2 py-1 rounded font-medium">
        {index === 0 ? "Main" : `#${index + 1}`}
      </div>
      <div className="absolute top-1 right-1 flex gap-1">
        <button
          onClick={onMarkMain}
          className="bg-yellow-300 text-black text-xs px-2 py-1 rounded hover:bg-yellow-400"
        >
          Make Main
        </button>
        <button
          onClick={onRemove}
          className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
