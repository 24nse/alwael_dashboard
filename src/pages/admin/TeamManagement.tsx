import { useState } from 'react';
import { PageHeader } from '@/components/admin/shared/AdminComponents';
import { useTeam } from '@/hooks/useTeam';
import { TeamMember } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Plus, Search, Pencil, Trash2, Phone, Mail, User, Loader2 } from 'lucide-react';

export default function TeamManagement() {
  const { teamMembers, loading, error, createTeamMember, updateTeamMember, deleteTeamMember, toggleActive } = useTeam();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    bio: '',
    image: '/placeholder.svg',
    isActive: true,
  });

  const filteredTeam = teamMembers.filter((member) =>
    member.name.includes(searchQuery) ||
    member.position.includes(searchQuery) ||
    member.department.includes(searchQuery)
  );

  const departments = ['الإدارة العليا', 'إدارة المشاريع', 'التسويق والمبيعات', 'الهندسة', 'الموارد البشرية', 'المالية'];

  const openAddDialog = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      department: '',
      phone: '',
      email: '',
      bio: '',
      image: '/placeholder.svg',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData);
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث بيانات العضو بنجاح',
        });
      } else {
        await createTeamMember(formData as Omit<TeamMember, 'id' | 'createdAt'>);
        toast({
          title: 'تم الإضافة',
          description: 'تم إضافة العضو بنجاح',
        });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Save team member error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء حفظ البيانات',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteTeamMember(id);
      toast({
        title: 'تم الحذف',
        description: 'تم حذف العضو بنجاح',
      });
    } catch (error: any) {
      console.error('Delete team member error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء حذف العضو',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleActive(id);
    } catch (error: any) {
      console.error('Toggle active error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء تحديث الحالة',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="إدارة فريق العمل"
        description="إضافة وتعديل وإدارة أعضاء الفريق"
      >
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة عضو
        </Button>
      </PageHeader>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم، المنصب، أو القسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Grid */}
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
      ) : filteredTeam.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          لا يوجد أعضاء فريق
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeam.map((member) => (
            <Card key={member.id} className={!member.isActive ? 'opacity-60' : ''}>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.image} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    <User className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary font-medium text-sm">{member.position}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.department}</p>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span dir="ltr">{member.phone}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">نشط</span>
                  <Switch
                    checked={member.isActive}
                    onCheckedChange={() => handleToggleActive(member.id)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(member)}
                  >
                    <Pencil className="w-4 h-4 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteMember(member.id)}
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
              {editingMember ? 'تعديل بيانات العضو' : 'إضافة عضو جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingMember ? 'تعديل بيانات عضو الفريق' : 'أدخل بيانات العضو الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>الاسم الكامل</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل الاسم الكامل"
                />
              </div>
              <div>
                <Label>المنصب</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="مثال: مدير المشاريع"
                />
              </div>
              <div>
                <Label>القسم</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>رقم الهاتف</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+967 5 000 0000"
                  dir="ltr"
                />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@alwael.com"
                  dir="ltr"
                />
              </div>
              <div className="col-span-2">
                <Label>نبذة مختصرة</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="نبذة مختصرة عن العضو وخبراته"
                  rows={3}
                />
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label>عضو نشط</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {editingMember ? 'حفظ التعديلات' : 'إضافة العضو'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
