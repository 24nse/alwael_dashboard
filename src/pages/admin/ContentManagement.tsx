import { useState } from 'react';
import { PageHeader } from '@/components/admin/shared/AdminComponents';
import { useContent } from '@/hooks/useContent';
import { ContentSection } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Pencil, Save, FileText, Image, Clock, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ContentManagement() {
  const { contentSections, loading, error, updateContentSection } = useContent();
  const { toast } = useToast();
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentSection>>({});

  const openEditDialog = (section: ContentSection) => {
    setEditingSection(section);
    setFormData(section);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingSection) {
      try {
        await updateContentSection(editingSection.id, formData);
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث محتوى القسم بنجاح',
        });
        setIsDialogOpen(false);
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء حفظ المحتوى',
          variant: 'destructive',
        });
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const section = contentSections.find(s => s.id === id);
      if (section) {
        await updateContentSection(id, { isActive: !section.isActive });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الحالة',
        variant: 'destructive',
      });
    }
  };

  const sectionIcons: Record<string, string> = {
    hero: '🏠',
    about: 'ℹ️',
    services: '🔧',
    projects: '🏗️',
    team: '👥',
    contact: '📞',
    testimonials: '⭐',
    partners: '🤝',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="إدارة محتوى الموقع"
        description="تعديل النصوص والصور في أقسام الموقع"
      />

      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="sections">أقسام الموقع</TabsTrigger>
          <TabsTrigger value="seo">SEO وميتا</TabsTrigger>
          <TabsTrigger value="media">الصور والوسائط</TabsTrigger>
        </TabsList>

        <TabsContent value="sections">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentSections.map((section) => (
                <Card key={section.id} className={!section.isActive ? 'opacity-60' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <span>{sectionIcons[section.sectionKey] || '📄'}</span>
                      {section.title}
                    </CardTitle>
                    <Switch
                      checked={section.isActive}
                      onCheckedChange={() => handleToggleActive(section.id)}
                    />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {section.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        آخر تحديث: {new Date(section.updatedAt).toLocaleDateString('ar-SA')}
                      </div>
                      <span className="bg-muted px-2 py-0.5 rounded">{section.sectionKey}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openEditDialog(section)}
                    >
                      <Pencil className="w-4 h-4 ml-2" />
                      تعديل المحتوى
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>عنوان الموقع (Title)</Label>
                <Input
                  defaultValue="مؤسسة الوعل للعقارات والمقاولات"
                  placeholder="عنوان الموقع"
                />
              </div>
              <div>
                <Label>وصف الموقع (Meta Description)</Label>
                <Textarea
                  defaultValue="مؤسسة رائدة في مجال العقارات والمقاولات في الجمهورية اليمنية - المكلا"
                  placeholder="وصف مختصر للموقع"
                  rows={3}
                />
              </div>
              <div>
                <Label>الكلمات المفتاحية</Label>
                <Input
                  defaultValue="عقارات، مقاولات، بناء، تطوير عقاري، اليمن، المكلا"
                  placeholder="كلمات مفتاحية مفصولة بفواصل"
                />
              </div>
              <Button>
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>مكتبة الوسائط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  اسحب الصور هنا أو اضغط للتحميل
                </p>
                <Button variant="outline">
                  <FileText className="w-4 h-4 ml-2" />
                  اختيار ملفات
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل قسم: {editingSection?.title}</DialogTitle>
            <DialogDescription>
              تعديل محتوى القسم المحدد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>عنوان القسم</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>المحتوى</Label>
              <Textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>
            <div>
              <Label>رابط الصورة (اختياري)</Label>
              <Input
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/section-image.jpg"
                dir="ltr"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
