import { useState, useRef } from 'react';
import { PageHeader, StatusBadge } from '@/components/admin/shared/AdminComponents';
import { useProjects } from '@/hooks/useProjects';
import { Project, ProjectStatus } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Calendar,
  Ruler,
  Star,
  Loader2,
  Upload,
  X,
  ImageIcon,
  Images,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Image Upload Helper ──────────────────────────────────────────────────────
async function uploadImageToStorage(file: File, projectTitle: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `projects/${projectTitle.replace(/\s+/g, '-')}/${fileName}`;

  const { error } = await supabase.storage
    .from('project-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from('project-images').getPublicUrl(filePath);
  return data.publicUrl;
}

// ─── Image Upload Zone Component ─────────────────────────────────────────────
interface ImageUploadZoneProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  projectTitle: string;
}

function ImageUploadZone({ images, onImagesChange, projectTitle }: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith('image/')
    );

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const uploaded: string[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      try {
        const title = projectTitle || 'project';
        const url = await uploadImageToStorage(validFiles[i], title);
        uploaded.push(url);
      } catch (err) {
        console.error('Upload error:', err);
      }
      setUploadProgress(Math.round(((i + 1) / validFiles.length) * 100));
    }

    onImagesChange([...images, ...uploaded]);
    setUploading(false);
    setUploadProgress(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/40'}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">جاري رفع الصور...</p>
            <Progress value={uploadProgress} className="h-1.5" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">اسحب الصور هنا أو اضغط للاختيار</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP — يمكن رفع أكثر من صورة</p>
          </div>
        )}
      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border bg-muted">
              <img
                src={url}
                alt={`صورة ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {index === 0 && (
                <span className="absolute bottom-1 right-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-medium">
                  رئيسية
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <span>لم يتم اختيار أي صور بعد</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProjectsManagement() {
  const { projects, loading, error, createProject, updateProject, deleteProject: deleteProjectHook } = useProjects();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: '',
    location: '',
    area: '',
    year: '',
    status: 'planning',
    featured: false,
    features: [],
    images: [],
  });

  const filteredProjects = projects.filter((project) =>
    project.title.includes(searchQuery) ||
    project.category.includes(searchQuery) ||
    project.location.includes(searchQuery)
  );

  const getStatusBadge = (status: ProjectStatus) => {
    const statusMap: Record<ProjectStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'default' }> = {
      planning: { label: 'تخطيط', variant: 'info' },
      in_progress: { label: 'قيد التنفيذ', variant: 'warning' },
      completed: { label: 'مكتمل', variant: 'success' },
      on_hold: { label: 'متوقف', variant: 'default' },
    };
    const { label, variant } = statusMap[status];
    return <StatusBadge status={label} variant={variant} />;
  };

  const openAddDialog = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      area: '',
      year: new Date().getFullYear().toString(),
      status: 'planning',
      featured: false,
      features: [],
      images: [],
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
        toast({ title: 'تم التحديث', description: 'تم تحديث المشروع بنجاح' });
      } else {
        await createProject(formData as Omit<Project, 'id' | 'createdAt'>);
        toast({ title: 'تم الإضافة', description: 'تم إضافة المشروع بنجاح' });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Save project error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء حفظ المشروع',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProjectHook(id);
      toast({ title: 'تم الحذف', description: 'تم حذف المشروع بنجاح' });
    } catch (error: any) {
      console.error('Delete project error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء حذف المشروع',
        variant: 'destructive',
      });
    }
  };

  const categories = ['مجمعات سكنية', 'تجاري', 'شقق', 'فلل', 'صناعي'];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="إدارة المشاريع"
        description="إضافة وتعديل وحذف المشاريع"
      >
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة مشروع
        </Button>
      </PageHeader>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم، الفئة، أو الموقع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="mr-3 text-muted-foreground">جاري التحميل...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          لا توجد مشاريع
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {project.images && project.images.length > 0 ? (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageIcon className="w-10 h-10 opacity-40" />
                    <span className="text-xs">لا توجد صور</span>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    مميز
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(project.status)}
                </div>
                {project.images && project.images.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Images className="w-3 h-3" />
                    {project.images.length}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {project.description}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      {project.area}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {project.year}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(project)}
                  >
                    <Pencil className="w-4 h-4 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? 'تعديل بيانات المشروع' : 'أدخل بيانات المشروع الجديد'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>اسم المشروع</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="أدخل اسم المشروع"
                />
              </div>
              <div>
                <Label>الفئة</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الحالة</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ProjectStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">تخطيط</SelectItem>
                    <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="on_hold">متوقف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الموقع</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="أدخل موقع المشروع"
                />
              </div>
              <div>
                <Label>المساحة</Label>
                <Input
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="مثال: 50,000 م²"
                />
              </div>
              <div>
                <Label>السنة</Label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2024"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label>مشروع مميز</Label>
              </div>
              <div className="col-span-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل وصف المشروع"
                  rows={4}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Images className="w-4 h-4" />
                صور المشروع
              </Label>
              <ImageUploadZone
                images={formData.images || []}
                onImagesChange={(imgs) => setFormData({ ...formData, images: imgs })}
                projectTitle={formData.title || 'project'}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              {editingProject ? 'حفظ التعديلات' : 'إضافة المشروع'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
