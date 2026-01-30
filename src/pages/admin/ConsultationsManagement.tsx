import { useState } from 'react';
import { PageHeader, StatusBadge } from '@/components/admin/shared/AdminComponents';
import { useConsultations } from '@/hooks/useConsultations';
import { Consultation, ConsultationStatus } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Eye, Trash2, Filter, Calendar, Clock, Phone, Mail, Loader2 } from 'lucide-react';

export default function ConsultationsManagement() {
  const { consultations, loading, error, updateConsultation, deleteConsultation: deleteConsultationHook } = useConsultations();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.customerName.includes(searchQuery) ||
      consultation.phone.includes(searchQuery) ||
      consultation.consultationType.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ConsultationStatus) => {
    const statusMap: Record<ConsultationStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'destructive' | 'default' }> = {
      pending: { label: 'في الانتظار', variant: 'warning' },
      scheduled: { label: 'مجدولة', variant: 'info' },
      completed: { label: 'مكتملة', variant: 'success' },
      cancelled: { label: 'ملغية', variant: 'destructive' },
    };
    const { label, variant } = statusMap[status];
    return <StatusBadge status={label} variant={variant} />;
  };

  const updateStatus = async (id: string, newStatus: ConsultationStatus) => {
    try {
      await updateConsultation(id, { status: newStatus });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث حالة الاستشارة بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الاستشارة',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConsultation = async (id: string) => {
    try {
      await deleteConsultationHook(id);
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الاستشارة بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف الاستشارة',
        variant: 'destructive',
      });
    }
  };

  const viewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="إدارة الاستشارات"
        description="عرض وإدارة طلبات الاستشارات"
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم، الهاتف، أو نوع الاستشارة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="scheduled">مجدولة</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
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
          ) : filteredConsultations.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              لا توجد استشارات
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">نوع الاستشارة</TableHead>
                  <TableHead className="text-right">التاريخ المفضل</TableHead>
                  <TableHead className="text-right">الوقت</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{consultation.customerName}</p>
                        <p className="text-sm text-muted-foreground">{consultation.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{consultation.consultationType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {consultation.preferredDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {consultation.preferredTime}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewConsultation(consultation)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteConsultation(consultation.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الاستشارة</DialogTitle>
            <DialogDescription>
              عرض جميع تفاصيل طلب الاستشارة
            </DialogDescription>
          </DialogHeader>
          {selectedConsultation && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-lg">{selectedConsultation.customerName}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{selectedConsultation.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{selectedConsultation.email}</span>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">نوع الاستشارة</p>
                  <p className="font-medium">{selectedConsultation.consultationType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الحالة</p>
                  <div className="mt-1">{getStatusBadge(selectedConsultation.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التاريخ المفضل</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedConsultation.preferredDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الوقت المفضل</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedConsultation.preferredTime}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">ملاحظات العميل</p>
                <p className="bg-muted/30 p-3 rounded-lg">{selectedConsultation.message}</p>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <span className="text-sm font-medium">تحديث الحالة:</span>
                <Select
                  value={selectedConsultation.status}
                  onValueChange={(value: ConsultationStatus) => {
                    updateStatus(selectedConsultation.id, value);
                    setSelectedConsultation({ ...selectedConsultation, status: value });
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="scheduled">مجدولة</SelectItem>
                    <SelectItem value="completed">مكتملة</SelectItem>
                    <SelectItem value="cancelled">ملغية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
