import { useEffect, useState } from 'react';
import { useReports } from '@/contexts/ReportsContext';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { severityColors, statusLabels } from '@/data/mockReports';
import 'leaflet/dist/leaflet.css';

const AdminMap = () => {
  const { reports } = useReports();
  const [severity, setSeverity] = useState('all');

  const filtered = severity === 'all' ? reports : reports.filter(r => r.aiResult.severity === severity);

  useEffect(() => {
    import('leaflet').then((L) => {
      const container = document.getElementById('admin-map');
      if (!container) return;
      // Clear previous
      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = undefined;
        container.innerHTML = '';
      }

      const map = L.map('admin-map').setView([25.5941, 85.1376], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      filtered.forEach((r) => {
        const color = severityColors[r.aiResult.severity];
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px ${color}"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        L.marker([r.location.lat, r.location.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:200px">
              <strong>${r.id}</strong><br/>
              <span style="color:${color};font-weight:bold">${r.aiResult.severity.toUpperCase()}</span> • ${r.aiResult.confidence}%<br/>
              <small>${r.location.address}</small><br/>
              <small>Status: ${statusLabels[r.status]}</small><br/>
              <small>Reporter: ${r.userName}</small>
            </div>
          `);
      });
    });
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">City Map</h1>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="dangerous">Dangerous</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        {[
          { label: 'Dangerous', color: severityColors.dangerous },
          { label: 'Moderate', color: severityColors.moderate },
          { label: 'Minor', color: severityColors.minor },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full" style={{ background: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <Card className="border-border/50 bg-card/80 overflow-hidden">
        <div id="admin-map" className="h-[600px] w-full" />
      </Card>
    </div>
  );
};

export default AdminMap;
