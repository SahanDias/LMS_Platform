import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { videosApi, coursesApi } from "@/services/api";
import { Video, Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoForm {
    title: string;
    description: string;
    videoUrl: string;
    courseId: number;
    duration: number;
    isFreePreview: boolean;
    status: "ACTIVE" | "INACTIVE";
}

const emptyForm: VideoForm = {
    title: "",
    description: "",
    videoUrl: "",
    courseId: 0,
    duration: 0,
    isFreePreview: false,
    status: "INACTIVE",
};

const VideosPage = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Video | null>(null);
    const [form, setForm] = useState<VideoForm>(emptyForm);
    const { toast } = useToast();

    const load = () => {
        videosApi.getAll().then(setVideos).catch(() => {
            toast({ title: "Failed to load videos", variant: "destructive" });
        });
        coursesApi.getAll().then(setCourses).catch(() => {
            toast({ title: "Failed to load courses", variant: "destructive" });
        });
    };

    useEffect(() => { load(); }, []);

    const filtered = videos.filter((v) =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        courses.find(c => c.id === v.courseId)?.title.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
    const openEdit = (v: Video) => {
        setEditing(v);
        setForm({
            title: v.title,
            description: v.description,
            videoUrl: v.videoUrl,
            courseId: v.courseId,
            duration: v.duration,
            isFreePreview: v.isFreePreview,
            status: v.status,
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (!form.courseId) {
                toast({ title: "Please select a course", variant: "destructive" });
                return;
            }

            if (editing) {
                await videosApi.update(editing.id, form);
                toast({ title: "Video updated" });
            } else {
                await videosApi.create(form);
                toast({ title: "Video created" });
            }
            setDialogOpen(false);
            load();
        } catch {
            toast({ title: "Failed to save video", variant: "destructive" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            if (confirm("Are you sure you want to delete this video?")) {
                await videosApi.delete(id);
                toast({ title: "Video deleted" });
                load();
            }
        } catch {
            toast({ title: "Failed to delete video", variant: "destructive" });
        }
    };

    const getCourseName = (courseId: number) => {
        const course = courses.find((c) => c.id === courseId);
        return course ? course.title : `Unknown (ID: ${courseId})`;
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Videos</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage course videos and library</p>
                </div>
                <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Video</Button>
            </div>

            <div className="relative mb-4 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by title or course..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Duration (mins)</TableHead>
                            <TableHead>Free Preview</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                    No videos found
                                </TableCell>
                            </TableRow>
                        ) : filtered.map((v) => (
                            <TableRow key={v.id}>
                                <TableCell className="font-medium">{v.title}</TableCell>
                                <TableCell>{getCourseName(v.courseId)}</TableCell>
                                <TableCell>{v.duration}</TableCell>
                                <TableCell>{v.isFreePreview ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    {v.videoUrl ? (
                                        <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                                            Link <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    ) : "-"}
                                </TableCell>
                                <TableCell><StatusBadge status={v.status} /></TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit Video" : "New Video"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                        <div className="space-y-2">
                            <Label>Video Title</Label>
                            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Introduction to React" />
                        </div>

                        <div className="space-y-2">
                            <Label>Course</Label>
                            <Select value={form.courseId.toString()} onValueChange={(v: string) => setForm({ ...form, courseId: Number(v) })}>
                                <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id.toString()}>{course.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe what this video covers..." />
                        </div>

                        <div className="space-y-2">
                            <Label>Video URL</Label>
                            <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Duration (minutes)</Label>
                                <Input type="number" min={0} value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={form.status} onValueChange={(v: string) => setForm({ ...form, status: v as "ACTIVE" | "INACTIVE" })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Switch id="free-preview" checked={form.isFreePreview} onCheckedChange={(checked) => setForm({ ...form, isFreePreview: checked })} />
                            <Label htmlFor="free-preview">Make this video available as a free preview</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Video"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default VideosPage;
