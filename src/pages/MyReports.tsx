import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/contexts/ReportsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { statusLabels } from '@/data/mockReports';
import { MapPin, Clock } from 'lucide-react';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  reported: 'destructive',
  under_review: 'secondary',
  in_progress: 'default',
  completed: 'outline',
};

const severityBadge: Record<string, string> = {
  minor: 'bg-success/10 text-success border-success/30',
  moderate: 'bg-warning/10 text-warning border-warning/30',
  dangerous: 'bg-danger/10 text-danger border-danger/30',
};

const MyReports = () => {
  const { user } = useAuth();
  const { reports } = useReports();
  const userReports = user ? reports.filter(r => r.userId === user.id) : [];

  return (
    <div className="dark min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-2 font-display text-3xl font-bold">My Reports</h1>
        <p className="mb-8 text-muted-foreground">{userReports.length} report(s) filed</p>

        {userReports.length === 0 ? (
          <Card className="border-border/50 bg-card/80 p-12 text-center">
            <p className="text-muted-foreground">You haven't submitted any reports yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {userReports.map(report => (
              <Card key={report.id} className="border-border/50 bg-card/80 overflow-hidden">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
                  <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:w-40">
                    <img src={report.imageUrl} alt="Report" className="h-full w-full object-cover" />
                    <div className={`absolute bottom-1 left-1 rounded px-2 py-0.5 text-xs font-bold border ${severityBadge[report.aiResult.severity]}`}>
                      {report.aiResult.severity.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-display font-semibold">{report.id}</h3>
                      <Badge variant={statusVariant[report.status]}>{statusLabels[report.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {report.location.address}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(report.createdAt).toLocaleDateString()}</span>
                      <span>Confidence: {report.aiResult.confidence}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
