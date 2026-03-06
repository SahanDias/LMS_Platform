import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classScheduleApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schema = z.object({
  scheduleStartAt: z.string().min(1, "Start date is required"),
  scheduleEndAt: z.string().min(1, "End date is required"),
  scheduleOpen: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  classId: string;
  classTitle: string;
  open: boolean;
  onClose: () => void;
}

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export default function ScheduleDrawer({ classId, classTitle, open, onClose }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { scheduleStartAt: "", scheduleEndAt: "", scheduleOpen: false },
  });

  const scheduleOpenVal = watch("scheduleOpen");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    classScheduleApi
      .getSchedule(classId)
      .then((s) =>
        reset({
          scheduleStartAt: toLocalInput(s.scheduleStartAt),
          scheduleEndAt: toLocalInput(s.scheduleEndAt),
          scheduleOpen: s.scheduleOpen ?? false,
        }),
      )
      .catch(() =>
        reset({ scheduleStartAt: "", scheduleEndAt: "", scheduleOpen: false }),
      )
      .finally(() => setLoading(false));
  }, [open, classId, reset]);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      await classScheduleApi.updateSchedule(classId, {
        scheduleStartAt: new Date(values.scheduleStartAt).toISOString(),
        scheduleEndAt: new Date(values.scheduleEndAt).toISOString(),
        scheduleOpen: values.scheduleOpen,
      });
      toast({ title: "Schedule updated" });
      onClose();
    } catch (e: unknown) {
      toast({
        title: "Failed to update schedule",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule — {classTitle}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleStartAt">Start</Label>
              <Input type="datetime-local" id="scheduleStartAt" {...register("scheduleStartAt")} />
              {errors.scheduleStartAt && (
                <p className="text-xs text-destructive">{errors.scheduleStartAt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduleEndAt">End</Label>
              <Input type="datetime-local" id="scheduleEndAt" {...register("scheduleEndAt")} />
              {errors.scheduleEndAt && (
                <p className="text-xs text-destructive">{errors.scheduleEndAt.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={scheduleOpenVal}
                onCheckedChange={(v) => setValue("scheduleOpen", v)}
              />
              <Label>Open (visible to students)</Label>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving…" : "Save Schedule"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
