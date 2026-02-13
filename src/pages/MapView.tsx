import { useEffect } from 'react';
import { useReports } from '@/contexts/ReportsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { severityColors, statusLabels } from '@/data/mockReports';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const { reports } = useReports();

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      const container = document.getElementById('citizen-map');
      if (!container || (container as any)._leaflet_id) return;

      const map = L.map('citizen-map').setView([33.6995, 73.0500], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      reports.forEach((r) => {
        const color = severityColors[r.aiResult.severity];
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 6px ${color}"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        L.marker([r.location.lat, r.location.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:180px">
              <strong>${r.id}</strong><br/>
              <span style="color:${color};font-weight:bold">${r.aiResult.severity.toUpperCase()}</span> • ${r.aiResult.confidence}%<br/>
              <small>${r.location.address}</small><br/>
              <small>Status: ${statusLabels[r.status]}</small>
            </div>
          `);
      });
    });
  }, [reports]);

  return (
    <div className="dark min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-2 font-display text-3xl font-bold">Pothole Map</h1>
        <p className="mb-4 text-muted-foreground">View reported road damage across the city</p>

        <div className="mb-4 flex gap-4">
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
          <div id="citizen-map" className="h-[500px] w-full" />
        </Card>
      </div>
    </div>
  );
};

export default MapView;
