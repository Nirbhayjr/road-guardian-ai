import { useReports } from '@/contexts/ReportsContext';
import { severityColors } from '@/data/mockReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, LineChart, Line } from 'recharts';
import { Download, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminAnalytics = () => {
  const { reports } = useReports();
  const { toast } = useToast();

  const severityData = [
    { name: 'Minor', value: reports.filter(r => r.aiResult.severity === 'minor').length, color: severityColors.minor },
    { name: 'Moderate', value: reports.filter(r => r.aiResult.severity === 'moderate').length, color: severityColors.moderate },
    { name: 'Dangerous', value: reports.filter(r => r.aiResult.severity === 'dangerous').length, color: severityColors.dangerous },
  ];

  const monthlyData = [
    { month: 'Sep', reports: 8 }, { month: 'Oct', reports: 12 }, { month: 'Nov', reports: 18 },
    { month: 'Dec', reports: 15 }, { month: 'Jan', reports: 22 }, { month: 'Feb', reports: reports.length },
  ];

  const areaData = [
    { area: 'Blue Area', count: 3 }, { area: 'F-8', count: 2 }, { area: 'G-9', count: 2 },
    { area: 'F-10', count: 2 }, { area: 'I-8', count: 1 }, { area: 'F-7', count: 2 },
    { area: 'I-10', count: 1 }, { area: 'G-6', count: 1 }, { area: 'E-11', count: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <Button variant="outline" onClick={() => toast({ title: 'PDF Report', description: 'Download started (demo)' })}>
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/80">
          <CardHeader><CardTitle className="text-lg">Severity Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={65} outerRadius={110} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
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
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(222,47%,9%)', border: '1px solid hsl(222,30%,18%)' }} />
                <Line type="monotone" dataKey="reports" stroke="hsl(217,91%,55%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/80">
        <CardHeader><CardTitle className="text-lg">Reports by Area</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
              <XAxis dataKey="area" stroke="hsl(215,20%,55%)" fontSize={11} angle={-30} textAnchor="end" height={60} />
              <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(222,47%,9%)', border: '1px solid hsl(222,30%,18%)' }} />
              <Bar dataKey="count" fill="hsl(217,91%,55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Predictive Analytics Placeholder */}
      <Card className="border-border/50 bg-card/80 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-card/90 backdrop-blur-sm z-10">
          <div className="text-center">
            <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="font-display font-semibold">Predictive Analytics</p>
            <p className="text-sm text-muted-foreground">Coming Soon</p>
          </div>
        </div>
        <CardHeader><CardTitle className="text-lg">Predictive Road Damage Forecast</CardTitle></CardHeader>
        <CardContent className="h-48" />
      </Card>
    </div>
  );
};

export default AdminAnalytics;
