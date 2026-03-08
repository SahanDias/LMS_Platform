import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { dashboardApi } from "@/services/api";
import { BookOpen, Users, DollarSign, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof dashboardApi.getStats>> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    dashboardApi.getStats().then(setStats).catch(() => setError(true));
  }, []);

  if (error) return <AdminLayout><div className="flex items-center justify-center h-64 text-destructive">Failed to load dashboard data.</div></AdminLayout>;
  if (!stats) return <AdminLayout><div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back to Lumina Learn admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Courses" value={stats.totalCourses} icon={BookOpen} trend="+2 this month" />
        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} icon={Users} trend="+12% growth" />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+8.5% this month" />
        <StatCard title="Active Quizzes" value={stats.activeQuizzes} icon={HelpCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">{p.userName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.courseName}</TableCell>
                    <TableCell className="text-sm font-medium">${p.amount}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
