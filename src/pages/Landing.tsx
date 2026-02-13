import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Brain, Camera, CheckCircle, AlertTriangle, TrendingUp, Shield, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const AnimatedCounter = ({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Landing = () => {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
        </div>
        <div className="container relative mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" /> AI-Powered Road Intelligence
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="mb-6 font-display text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Smarter Roads,{' '}
              <span className="text-gradient">Safer Cities</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Advanced AI pothole detection and road damage management system.
              Report, detect, and resolve road issues in real-time.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/report">
                <Button size="lg" className="glow-primary px-8 text-base">
                  <Camera className="mr-2 h-5 w-5" /> Report a Pothole
                </Button>
              </Link>
              <Link to="/map">
                <Button size="lg" variant="outline" className="px-8 text-base">
                  <MapPin className="mr-2 h-5 w-5" /> View Map
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
          {[
            { label: 'Reports Filed', value: 2847, suffix: '+', icon: AlertTriangle },
            { label: 'Roads Repaired', value: 1923, suffix: '+', icon: CheckCircle },
            { label: 'AI Accuracy', value: 94, suffix: '%', icon: Brain },
            { label: 'Cities Active', value: 12, suffix: '', icon: MapPin },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
              <div className="font-display text-3xl font-bold md:text-4xl">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to safer roads</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Camera, title: 'Upload Image', desc: 'Snap a photo of road damage and upload it through our citizen portal.' },
              { icon: Brain, title: 'AI Detection', desc: 'Our AI model detects potholes, draws bounding boxes, and classifies severity.' },
              { icon: CheckCircle, title: 'City Response', desc: 'Municipal teams receive prioritized alerts and track repairs in real-time.' },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-card/80 transition-all hover:border-primary/50 hover:glow-primary">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardContent className="relative p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="mb-1 font-display text-xs font-semibold uppercase tracking-wider text-primary">
                      Step {i + 1}
                    </div>
                    <h3 className="mb-2 font-display text-xl font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-card/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">Key Features</h2>
            <p className="text-muted-foreground">Powered by cutting-edge AI and smart city technology</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Brain, title: 'AI Detection', desc: 'YOLO-based pothole detection with 94%+ accuracy' },
              { icon: MapPin, title: 'GPS Tracking', desc: 'Automatic geolocation for precise damage mapping' },
              { icon: TrendingUp, title: 'Analytics', desc: 'Real-time dashboards and predictive insights' },
              { icon: Shield, title: 'Verified Reports', desc: 'Image authenticity validation and duplicate detection' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="border-border/50 bg-card/60 p-6">
                  <f.icon className="mb-3 h-8 w-8 text-accent" />
                  <h3 className="mb-1 font-display font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-12">
              <h2 className="mb-3 font-display text-3xl font-bold">Ready to Report?</h2>
              <p className="mb-8 text-muted-foreground">
                Help us build safer roads. Report road damage and our AI will take care of the rest.
              </p>
              <Link to="/signup">
                <Button size="lg" className="glow-primary px-8">Get Started Free</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">SmartRoad AI</span>
          </div>
          <p>© 2026 SmartRoad AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
