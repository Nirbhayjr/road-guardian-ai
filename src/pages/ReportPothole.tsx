import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/contexts/ReportsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, MapPin, Loader2, CheckCircle, AlertTriangle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Severity } from '@/types';

const ReportPothole = () => {
  const { user } = useAuth();
  const { addReport } = useReports();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<{ confidence: number; severity: Severity; box: { x: number; y: number; w: number; h: number } } | null>(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setAiResult(null);
      simulateAI();
    };
    reader.readAsDataURL(file);
  };

  const simulateAI = () => {
    setProcessing(true);
    setTimeout(() => {
      const confidence = 75 + Math.random() * 23;
      const boxW = 80 + Math.random() * 160;
      const boxH = 60 + Math.random() * 120;
      let severity: Severity = 'minor';
      const area = boxW * boxH;
      if (area > 18000) severity = 'dangerous';
      else if (area > 10000) severity = 'moderate';

      setAiResult({
        confidence: Math.round(confidence * 10) / 10,
        severity,
        box: { x: 50 + Math.random() * 100, y: 30 + Math.random() * 80, w: boxW, h: boxH },
      });
      setProcessing(false);
    }, 2500);
  };

  const getLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setAddress(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
          setGettingLocation(false);
        },
        () => {
          setCoords({ lat: 33.6844, lng: 73.0479 });
          setAddress('Blue Area, Islamabad (default)');
          setGettingLocation(false);
        }
      );
    } else {
      setCoords({ lat: 33.6844, lng: 73.0479 });
      setAddress('Blue Area, Islamabad (default)');
      setGettingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !aiResult || !coords) return;

    addReport({
      id: `RPT-${Date.now()}`,
      userId: user?.id || 'anon',
      userName: user?.name || 'Anonymous',
      imageUrl: image,
      location: { lat: coords.lat, lng: coords.lng, address },
      aiResult: {
        confidence: aiResult.confidence,
        severity: aiResult.severity,
        boundingBox: { x: aiResult.box.x, y: aiResult.box.y, width: aiResult.box.w, height: aiResult.box.h },
        verified: true,
      },
      status: 'reported',
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    toast({ title: 'Report Submitted!', description: 'Your report has been filed successfully.' });
    navigate('/my-reports');
  };

  const severityConfig = {
    minor: { label: 'Minor', color: 'text-success', bg: 'bg-success/10' },
    moderate: { label: 'Moderate', color: 'text-warning', bg: 'bg-warning/10' },
    dangerous: { label: 'Dangerous', color: 'text-danger', bg: 'bg-danger/10' },
  };

  return (
    <div className="dark min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-2 font-display text-3xl font-bold">Report Road Damage</h1>
        <p className="mb-8 text-muted-foreground">Upload an image and our AI will analyze it automatically.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Camera className="h-5 w-5 text-primary" /> Upload Image</CardTitle></CardHeader>
            <CardContent>
              {!image ? (
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 transition-colors hover:border-primary/50"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload an image of road damage</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl">
                    <img src={image} alt="Uploaded" className="w-full" />
                    {aiResult && (
                      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300">
                        <rect
                          x={aiResult.box.x} y={aiResult.box.y}
                          width={aiResult.box.w} height={aiResult.box.h}
                          fill="none"
                          stroke={aiResult.severity === 'dangerous' ? '#ef4444' : aiResult.severity === 'moderate' ? '#f59e0b' : '#22c55e'}
                          strokeWidth="3"
                          strokeDasharray="8 4"
                        />
                        <text x={aiResult.box.x} y={aiResult.box.y - 8} fill={aiResult.severity === 'dangerous' ? '#ef4444' : aiResult.severity === 'moderate' ? '#f59e0b' : '#22c55e'} fontSize="14" fontWeight="bold">
                          Pothole {aiResult.confidence}%
                        </text>
                      </svg>
                    )}
                  </div>

                  {processing && (
                    <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <div>
                        <p className="text-sm font-medium">AI Processing...</p>
                        <p className="text-xs text-muted-foreground">Analyzing image for road damage</p>
                      </div>
                    </div>
                  )}

                  {aiResult && !processing && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="font-display text-xl font-bold text-primary">{aiResult.confidence}%</p>
                      </div>
                      <div className={`rounded-lg p-3 text-center ${severityConfig[aiResult.severity].bg}`}>
                        <p className="text-xs text-muted-foreground">Severity</p>
                        <p className={`font-display text-xl font-bold ${severityConfig[aiResult.severity].color}`}>
                          {severityConfig[aiResult.severity].label}
                        </p>
                      </div>
                      <div className="rounded-lg bg-success/10 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="flex items-center justify-center gap-1 font-display text-sm font-bold text-success">
                          <CheckCircle className="h-4 w-4" /> Verified
                        </p>
                      </div>
                    </div>
                  )}

                  <Button type="button" variant="outline" size="sm" onClick={() => { setImage(null); setAiResult(null); }}>
                    Upload Different Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><MapPin className="h-5 w-5 text-primary" /> Location</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" variant="outline" onClick={getLocation} disabled={gettingLocation}>
                {gettingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                {gettingLocation ? 'Getting Location...' : 'Auto-detect Location'}
              </Button>
              <div className="space-y-2">
                <Label>Address / Location</Label>
                <Input value={address} onChange={e => { setAddress(e.target.value); if (!coords) setCoords({ lat: 33.6844, lng: 73.0479 }); }} placeholder="Enter location manually" required />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><AlertTriangle className="h-5 w-5 text-primary" /> Description</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the road damage..." rows={3} required />
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={!image || !aiResult || !coords || processing}>
            Submit Report
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReportPothole;
