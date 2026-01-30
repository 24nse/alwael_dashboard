import {
  ShoppingCart,
  MessageSquare,
  Building2,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpLeft,
  Loader2,
} from 'lucide-react';
import { StatCard, PageHeader, StatusBadge } from '@/components/admin/shared/AdminComponents';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useOrders } from '@/hooks/useOrders';
import { useConsultations } from '@/hooks/useConsultations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { orders, loading: ordersLoading } = useOrders();
  const { consultations, loading: consultationsLoading } = useConsultations();

  const recentOrders = orders.slice(0, 3);
  const recentConsultations = consultations.slice(0, 3);

  const getOrderStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'default' }> = {
      new: { label: 'جديد', variant: 'info' },
      in_progress: { label: 'قيد التنفيذ', variant: 'warning' },
      completed: { label: 'مكتمل', variant: 'success' },
      archived: { label: 'مؤرشف', variant: 'default' },
    };
    const { label, variant } = statusMap[status] || statusMap.new;
    return <StatusBadge status={label} variant={variant} />;
  };

  const getConsultationStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'destructive' | 'default' }> = {
      pending: { label: 'في الانتظار', variant: 'warning' },
      scheduled: { label: 'مجدولة', variant: 'info' },
      completed: { label: 'مكتملة', variant: 'success' },
      cancelled: { label: 'ملغية', variant: 'destructive' },
    };
    const { label, variant } = statusMap[status] || statusMap.pending;
    return <StatusBadge status={label} variant={variant} />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="لوحة التحكم"
        description="مرحباً بك في لوحة تحكم مؤسسة الوعل"
      />

      {/* Stats Grid */}
      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="mr-3 text-muted-foreground">جاري تحميل الإحصائيات...</span>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="إجمالي الطلبات"
            value={stats.totalOrders}
            change={`+${stats.newOrders} جديد`}
            changeType="positive"
            icon={ShoppingCart}
            iconColor="bg-primary/10 text-primary"
          />
          <StatCard
            title="الاستشارات"
            value={stats.totalConsultations}
            change={`${stats.pendingConsultations} في الانتظار`}
            changeType="neutral"
            icon={MessageSquare}
            iconColor="bg-info/10 text-info"
          />
          <StatCard
            title="المشاريع"
            value={stats.totalProjects}
            change={`${stats.activeProjects} نشط`}
            changeType="positive"
            icon={Building2}
            iconColor="bg-success/10 text-success"
          />
          <StatCard
            title="فريق العمل"
            value={stats.totalTeamMembers}
            change={`${stats.activeTeamMembers} نشط`}
            changeType="neutral"
            icon={Users}
            iconColor="bg-warning/10 text-warning"
          />
        </div>
      ) : null}

      {/* Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">نظرة عامة على الأداء</CardTitle>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 ml-2" />
              هذا الشهر
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>الرسم البياني سيظهر هنا</p>
                <p className="text-sm">جاهز للربط مع البيانات الفعلية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/projects">
              <Button className="w-full justify-start" variant="outline">
                <Building2 className="w-4 h-4 ml-2" />
                إضافة مشروع جديد
              </Button>
            </Link>
            <Link to="/admin/team">
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 ml-2" />
                إضافة عضو للفريق
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="w-4 h-4 ml-2" />
                عرض الطلبات الجديدة
              </Button>
            </Link>
            <Link to="/admin/consultations">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="w-4 h-4 ml-2" />
                عرض الاستشارات
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">أحدث الطلبات</CardTitle>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">
                عرض الكل
                <ArrowUpLeft className="w-4 h-4 mr-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{order.customerName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{order.propertyType}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                    {getOrderStatusBadge(order.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Consultations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">أحدث الاستشارات</CardTitle>
            <Link to="/admin/consultations">
              <Button variant="ghost" size="sm">
                عرض الكل
                <ArrowUpLeft className="w-4 h-4 mr-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {consultationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {recentConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{consultation.customerName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{consultation.consultationType}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {consultation.preferredDate}
                        </span>
                      </div>
                    </div>
                    {getConsultationStatusBadge(consultation.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
