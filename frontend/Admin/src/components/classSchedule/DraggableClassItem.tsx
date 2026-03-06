import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import type { ClassEntity } from "@/types";

interface Props {
  item: ClassEntity;
  onEdit: (c: ClassEntity) => void;
  onDelete: (c: ClassEntity) => void;
  onSchedule: (c: ClassEntity) => void;
}

export default function DraggableClassItem({ item, onEdit, onDelete, onSchedule }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{item.title}</span>
          <StatusBadge status={item.status} />
          {item.isFree && (
            <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 border-purple-200">
              Free
            </span>
          )}
        </div>
        {item.description && (
          <p className="mt-0.5 text-sm text-muted-foreground truncate">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => onSchedule(item)} title="Schedule">
          <Calendar className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onEdit(item)} title="Edit">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(item)} title="Delete">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
