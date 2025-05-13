import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  FieldArrayWithId,
  FieldValues,
  UseFieldArrayMove,
} from "react-hook-form";

export const handleDragEnd = <T extends FieldValues>(
  { active, over }: DragEndEvent,
  fields: FieldArrayWithId<T>[],
  move: UseFieldArrayMove,
) => {
  if (over && over.id !== active.id) {
    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);

    move(oldIndex, newIndex);

    return arrayMove(fields, oldIndex, newIndex);
  }
};
