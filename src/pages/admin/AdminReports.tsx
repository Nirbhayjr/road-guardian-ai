import { useState } from 'react';
import { useReports } from '@/contexts/ReportsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { statusLabels } from '@/data/mockReports';
import { PotholeReport, ReportStatus } from '@/types';
import { Search, MapPin, Clock, AlertTriangle } from 'lucide-react';

const severityBadge: Record<string, string> = {
  minor: 'bg-success/10 text-success border-success/30',
  moderate: 'bg-warning/10 text-warning border-warning/30',
  dangerous: 'bg-danger/10 text-danger border-danger/30',
};

const AdminReports = () => {
  const { reports, updateStatus } = useReports();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<PotholeReport | null>(null);

  const filtered = reports.filter(r => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.location.address.toLowerCase().includes(search.toLowerCase())) return false;
    if (severityFilter !== 'all' && r.aiResult.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Report Management</h1>

      <Card className="border-border/50 bg-card/80">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="dangerous">Dangerous</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(r => (
              <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                <TableCell className="font-medium">{r.id}</TableCell>
                <TableCell className="max-w-[200px] truncate text-sm">{r.location.address}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={severityBadge[r.aiResult.severity]}>
                    {r.aiResult.severity === 'dangerous' && <AlertTriangle className="mr-1 h-3 w-3" />}
                    {r.aiResult.severity.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell><Badge variant="outline">{statusLabels[r.status]}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    {r.status !== 'in_progress' && r.status !== 'completed' && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, 'in_progress')}>In Progress</Button>
                    )}
                    {r.status !== 'completed' && (
                      <Button size="sm" onClick={() => updateStatus(r.id, 'completed')}>Complete</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.id} – Report Detail</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <img src={selected.imageUrl} alt="Report" className="w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Severity:</span> <span className="font-bold">{selected.aiResult.severity.toUpperCase()}</span></div>
                <div><span className="text-muted-foreground">Confidence:</span> <span className="font-bold">{selected.aiResult.confidence}%</span></div>
                <div><span className="text-muted-foreground">Status:</span> {statusLabels[selected.status]}</div>
                <div><span className="text-muted-foreground">Reporter:</span> {selected.userName}</div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" /> {selected.location.address}
              </div>
              <p className="text-sm">{selected.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReports;
