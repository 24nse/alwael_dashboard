import { PageHeader } from '@/components/admin/shared/AdminComponents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, User, Shield, Bell, Palette, Plus, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const admins = [
    { id: '1', name: 'عبدالله الوعل', email: 'admin@alwael.com', role: 'super_admin', lastLogin: '2024-01-16' },
    { id: '2', name: 'محمد الكندي', email: 'mohammed@alwael.com', role: 'admin', lastLogin: '2024-01-15' },
    { id: '3', name: 'سعيد الحضرمي', email: 'saeed@alwael.com', role: 'editor', lastLogin: '2024-01-14' },
  ];

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      super_admin: { label: 'مدير عام', variant: 'default' },
      admin: { label: 'مدير', variant: 'secondary' },
      editor: { label: 'محرر', variant: 'outline' },
    };
    const { label, variant } = roles[role] || roles.editor;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="الإعدادات"
        description="إعدادات النظام وإدارة الصلاحيات"
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات المؤسسة</CardTitle>
                <CardDescription>البيانات الأساسية للمؤسسة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>اسم المؤسسة</Label>
                  <Input defaultValue="مؤسسة الوعل للعقارات والمقاولات" />
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input type="email" defaultValue="info@alwael.com" dir="ltr" />
                </div>
                <div>
                  <Label>رقم الهاتف</Label>
                  <Input defaultValue="+967 5 000 0000" dir="ltr" />
                </div>
                <div>
                  <Label>العنوان</Label>
                  <Input defaultValue="المكلا، الجمهورية اليمنية" />
                </div>
                <Button>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>حسابي</CardTitle>
                <CardDescription>إعدادات الحساب الشخصي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">تغيير الصورة</Button>
                </div>
                <div>
                  <Label>الاسم</Label>
                  <Input defaultValue="عبدالله الوعل" />
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input type="email" defaultValue="admin@alwael.com" dir="ltr" />
                </div>
                <Button variant="outline" className="w-full">
                  تغيير كلمة المرور
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  إدارة المستخدمين والصلاحيات
                </CardTitle>
                <CardDescription>إضافة وتعديل صلاحيات المستخدمين</CardDescription>
              </div>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                إضافة مستخدم
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المستخدم</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">الصلاحية</TableHead>
                    <TableHead className="text-right">آخر دخول</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {admin.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {admin.name}
                        </div>
                      </TableCell>
                      <TableCell dir="ltr">{admin.email}</TableCell>
                      <TableCell>{getRoleBadge(admin.role)}</TableCell>
                      <TableCell>{admin.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select defaultValue={admin.role}>
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="super_admin">مدير عام</SelectItem>
                              <SelectItem value="admin">مدير</SelectItem>
                              <SelectItem value="editor">محرر</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>التحكم في الإشعارات المرسلة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات الطلبات الجديدة</p>
                  <p className="text-sm text-muted-foreground">استلام إشعار عند وصول طلب جديد</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات الاستشارات</p>
                  <p className="text-sm text-muted-foreground">استلام إشعار عند طلب استشارة</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات البريد الإلكتروني</p>
                  <p className="text-sm text-muted-foreground">إرسال نسخة للبريد الإلكتروني</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">الملخص اليومي</p>
                  <p className="text-sm text-muted-foreground">تقرير يومي بالنشاطات</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                إعدادات المظهر
              </CardTitle>
              <CardDescription>تخصيص مظهر لوحة التحكم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">وضع العرض</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex-1">
                    ☀️ فاتح
                  </Button>
                  <Button variant="outline" className="flex-1">
                    🌙 داكن
                  </Button>
                  <Button variant="default" className="flex-1">
                    💻 تلقائي
                  </Button>
                </div>
              </div>
              <div>
                <Label className="mb-3 block">اللون الرئيسي</Label>
                <div className="flex items-center gap-3">
                  {['#d97706', '#2563eb', '#16a34a', '#dc2626', '#9333ea'].map((color) => (
                    <button
                      key={color}
                      className="w-10 h-10 rounded-full border-2 border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">تأثيرات الحركة</p>
                  <p className="text-sm text-muted-foreground">تفعيل التأثيرات المتحركة</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
