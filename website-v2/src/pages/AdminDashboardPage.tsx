import React, { useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  TrendingUp,
  Activity,
  RefreshCw
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { stats, loading, error, fetchStats } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const StatCard: React.FC<{
    title: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    trend?: number;
    color?: string;
  }> = ({ title, value, description, icon, trend, color = 'text-primary' }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={color}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend !== undefined && (
          <div className="flex items-center pt-1">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-xs text-green-500">+{trend}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const StatusCard: React.FC<{
    title: string;
    count: number;
    total: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = ({ title, count, total, icon, color, onClick }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
      <Card className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} onClick={onClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={color}>{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground">{percentage}% of total forms</p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-muted-foreground">Unable to load dashboard statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of users, forms, and system activity
          </p>
        </div>
        <Button onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          description="Registered users"
          icon={<Users className="h-4 w-4" />}
          color="text-blue-600"
          trend={stats.users.recent > 0 ? Math.round((stats.users.recent / Math.max(stats.users.total - stats.users.recent, 1)) * 100) : 0}
        />
        <StatCard
          title="Verified Users"
          value={stats.users.verified}
          description={`${Math.round((stats.users.verified / Math.max(stats.users.total, 1)) * 100)}% verification rate`}
          icon={<CheckCircle className="h-4 w-4" />}
          color="text-green-600"
        />
        <StatCard
          title="Users with Forms"
          value={stats.users.withForms}
          description={`${Math.round((stats.users.withForms / Math.max(stats.users.total, 1)) * 100)}% completion rate`}
          icon={<FileText className="h-4 w-4" />}
          color="text-purple-600"
        />
        <StatCard
          title="Total Forms"
          value={stats.forms.total}
          description="Treatment forms submitted"
          icon={<FileText className="h-4 w-4" />}
          color="text-orange-600"
          trend={stats.forms.recent > 0 ? Math.round((stats.forms.recent / Math.max(stats.forms.total - stats.forms.recent, 1)) * 100) : 0}
        />
      </div>

      {/* Form Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Submitted Forms"
          count={stats.forms.submitted}
          total={stats.forms.total}
          icon={<Clock className="h-4 w-4" />}
          color="text-yellow-600"
          onClick={() => navigate('/admin/forms?status=submitted')}
        />
        <StatusCard
          title="Under Review"
          count={stats.forms.underReview}
          total={stats.forms.total}
          icon={<AlertCircle className="h-4 w-4" />}
          color="text-blue-600"
          onClick={() => navigate('/admin/forms?status=under_review')}
        />
        <StatusCard
          title="Approved Forms"
          count={stats.forms.approved}
          total={stats.forms.total}
          icon={<CheckCircle className="h-4 w-4" />}
          color="text-green-600"
          onClick={() => navigate('/admin/forms?status=approved')}
        />
        <StatusCard
          title="Rejected Forms"
          count={stats.forms.rejected}
          total={stats.forms.total}
          icon={<XCircle className="h-4 w-4" />}
          color="text-red-600"
          onClick={() => navigate('/admin/forms?status=rejected')}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="h-6 w-6" />
              Manage Users
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/admin/forms')}
            >
              <FileText className="h-6 w-6" />
              Review Forms
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/admin/documents')}
            >
              <FileText className="h-6 w-6" />
              View Documents
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">New Users</span>
              <Badge variant="secondary">{stats.users.recent}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New Forms</span>
              <Badge variant="secondary">{stats.forms.recent}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Forms Under Review</span>
              <Badge variant="outline">{stats.forms.underReview}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">User Verification Rate</span>
              <Badge variant={stats.users.verified / Math.max(stats.users.total, 1) > 0.8 ? "default" : "secondary"}>
                {Math.round((stats.users.verified / Math.max(stats.users.total, 1)) * 100)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Form Completion Rate</span>
              <Badge variant={stats.users.withForms / Math.max(stats.users.total, 1) > 0.6 ? "default" : "secondary"}>
                {Math.round((stats.users.withForms / Math.max(stats.users.total, 1)) * 100)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Forms Processed</span>
              <Badge variant="outline">
                {stats.forms.approved + stats.forms.rejected} / {stats.forms.submitted + stats.forms.underReview}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
