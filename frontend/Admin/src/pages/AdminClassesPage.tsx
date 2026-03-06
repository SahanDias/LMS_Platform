import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { classScheduleApi, coursesApi } from "@/services/api";
import type { ClassEntity, ClassStatus, Course } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import ClassForm, { type ClassFormValues } from "@/components/classSchedule/ClassForm";
import ScheduleDrawer from "@/components/classSchedule/ScheduleDrawer";
import DraggableClassItem from "@/components/classSchedule/DraggableClassItem";

const AdminClassesPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ── Course picker (when no courseId in URL) ───
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setCoursesLoading(true);
      coursesApi
        .getAll()
        .then(setCourses)
        .catch(() => toast({ title: "Failed to load courses", variant: "destructive" }))
        .finally(() => setCoursesLoading(false));
    }
  }, [courseId, toast]);

  // Find selected course name for the header
  const [courseName, setCourseName] = useState<string>("");
  useEffect(() => {
    if (courseId && courses.length > 0) {
      const found = courses.find((c) => String(c.id) === courseId);
      if (found) setCourseName(found.title);
    }
  }, [courseId, courses]);

  // ── State ─────────────────────────────────────
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ClassStatus | "ALL">("ALL");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClassEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClassEntity | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<ClassEntity | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Fetch ─────────────────────────────────────
  const load = useCallback(() => {
    if (!courseId) return;
    setLoading(true);
    classScheduleApi
      .getByCourse(courseId, statusFilter === "ALL" ? undefined : statusFilter)
      .then(setClasses)
      .catch(() => toast({ title: "Failed to load classes", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [courseId, statusFilter, toast]);

  useEffect(() => { load(); }, [load]);

  // ── Create ────────────────────────────────────
  const handleCreate = async (values: ClassFormValues) => {
    if (!courseId) return;
    setSaving(true);
    try {
      await classScheduleApi.create({ ...values, title: values.title, courseId: Number(courseId) });
      toast({ title: "Class created" });
      setCreateOpen(false);
      load();
    } catch (e: unknown) {
      toast({ title: "Failed to create class", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ──────────────────────────────────────
  const handleEdit = async (values: ClassFormValues) => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await classScheduleApi.update(editTarget.id, values);
      toast({ title: "Class updated" });
      setEditTarget(null);
      load();
    } catch (e: unknown) {
      toast({ title: "Failed to update class", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await classScheduleApi.delete(deleteTarget.id);
      toast({ title: "Class deleted" });
      setDeleteTarget(null);
      load();
    } catch (e: unknown) {
      toast({ title: "Failed to delete class", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // ── Drag & Drop ───────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!courseId) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = classes.findIndex((c) => c.id === active.id);
    const newIdx = classes.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(classes, oldIdx, newIdx);
    setClasses(reordered);

    try {
      await classScheduleApi.reorder(
        courseId,
        reordered.map((c, i) => ({ classId: c.id, position: i + 1 })),
      );
      toast({ title: "Order saved" });
    } catch (e: unknown) {
      toast({ title: "Reorder failed", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
      load();
    }
  };

  // ── Render ────────────────────────────────────
  if (!courseId) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Class Schedule</h1>
            <p className="text-sm text-muted-foreground">
              Select a course to manage its classes.
            </p>
          </div>
          {coursesLoading ? (
            <Skeleton className="h-10 w-full max-w-sm rounded-md" />
          ) : courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No courses found. Create a course first.</p>
          ) : (
            <div className="w-full max-w-sm">
              <Select onValueChange={(id) => navigate(`/courses/${id}/classes`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Classes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {courseName || `Course ${courseId}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ClassStatus | "ALL")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Class
          </Button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <p className="text-sm">No classes yet. Create one to get started.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={classes.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {classes.map((c) => (
                <DraggableClassItem
                  key={c.id}
                  item={c}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                  onSchedule={setScheduleTarget}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Class</DialogTitle>
          </DialogHeader>
          <ClassForm onSubmit={handleCreate} loading={saving} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(v) => !v && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <ClassForm
              key={editTarget.id}
              initial={editTarget}
              onSubmit={handleEdit}
              loading={saving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete class?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete "{deleteTarget?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={saving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Schedule Drawer */}
      {scheduleTarget && (
        <ScheduleDrawer
          classId={scheduleTarget.id}
          classTitle={scheduleTarget.title}
          open={!!scheduleTarget}
          onClose={() => setScheduleTarget(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminClassesPage;
