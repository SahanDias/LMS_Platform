import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassEntity, ClassStatus } from "@/types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"] as const).optional(),
  isFree: z.boolean().optional(),
});

export type ClassFormValues = z.infer<typeof schema>;

interface Props {
  initial?: ClassEntity | null;
  onSubmit: (values: ClassFormValues) => void;
  loading?: boolean;
}

export default function ClassForm({ initial, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      status: (initial?.status as ClassStatus) ?? "DRAFT",
      isFree: initial?.isFree ?? false,
    },
  });

  const statusValue = watch("status");
  const isFreeValue = watch("isFree");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={3} />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={statusValue}
          onValueChange={(v) => setValue("status", v as ClassStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={isFreeValue}
          onCheckedChange={(v) => setValue("isFree", v)}
        />
        <Label>Free class</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving…" : initial ? "Update Class" : "Create Class"}
      </Button>
    </form>
  );
}
