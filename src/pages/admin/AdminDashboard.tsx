import { useReports } from '@/contexts/ReportsContext';
import { getDashboardStats, severityColors, statusLabels } from '@/data/mockReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, FileText, TrendingUp, Brain } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const { reports } = useReports();
  const stats = getDashboardStats(reports);

  const severityData = [
    { name: 'Minor', value: reports.filter(r => r.aiResult.severity === 'minor').length, color: severityColors.minor },
    { name: 'Moderate', value: reports.filter(r => r.aiResult.severity === 'moderate').length, color: severityColors.moderate },
    { name: 'Dangerous', value: reports.filter(r => r.aiResult.severity === 'dangerous').length, color: severityColors.dangerous },
  ];

  const monthlyData = [
    { month: 'Sep', reports: 8 }, { month: 'Oct', reports: 12 }, { month: 'Nov', reports: 18 },
    { month: 'Dec', reports: 15 }, { month: 'Jan', reports: 22 }, { month: 'Feb', reports: reports.length },
  ];

  const statCards = [
    { label: 'Total Reports', value: stats.totalReports, icon: FileText, color: 'text-primary' },
    { label: 'High Priority', value: stats.highPriority, icon: AlertTriangle, color: 'text-danger' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-success' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time road damage analytics</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(s => (
          <Card key={s.label} className="border-border/50 bg-card/80">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="font-display text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/80">
          <CardHeader><CardTitle className="text-lg">Severity Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {severityData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80">
          <CardHeader><CardTitle className="text-lg">Monthly Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(222,47%,9%)', border: '1px solid hsl(222,30%,18%)' }} />
                <Line type="monotone" dataKey="reports" stroke="hsl(217,91%,55%)" strokeWidth={2} dot={{ fill: 'hsl(217,91%,55%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent reports */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader><CardTitle className="text-lg">Recent Reports</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <img src={r.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{r.id}</span>
                    <Badge variant="outline" className="text-xs">{statusLabels[r.status]}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{r.location.address}</p>
                </div>
                <div className="text-right text-xs">
                  <span className={r.aiResult.severity === 'dangerous' ? 'text-danger font-bold' : r.aiResult.severity === 'moderate' ? 'text-warning' : 'text-success'}>
                    {r.aiResult.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
