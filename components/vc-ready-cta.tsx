'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Rocket, 
  ArrowRight, 
  Calendar, 
  Download,
  Code,
  Star,
  Award,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Users,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { ContactForm } from '@/components/contact-form';

const ctaFeatures = [
  {
    icon: Rocket,
    title: "Production Ready",
    description: "11 AWS services deployed, 99.9% uptime SLA"
  },
  {
    icon: Sparkles,
    title: "User-Defined Experts",
    description: "Revolutionary AI specialization - no rigid templates"
  },
  {
    icon: TrendingUp,
    title: "Proven Performance",
    description: "8.5/10 expert validation, 450x faster retrieval"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "JWT auth, user isolation, audit logging"
  }
];

const investmentHighlights = [
  {
    title: "Market Opportunity",
    value: "$50B+",
    description: "AI infrastructure market size by 2027",
    trend: "Growing 40% annually"
  },
  {
    title: "Technical Moat",
    value: "3 Patents",
    description: "Filed for core innovations",
    trend: "Defensible IP portfolio"
  },
  {
    title: "Customer Validation",
    value: "8.5/10",
    description: "Expert performance score",
    trend: "Beats human professionals"
  },
  {
    title: "Revenue Model",
    value: "SaaS + Usage",
    description: "Scalable pricing tiers",
    trend: "High margin potential"
  }
];

export default function VCReadyCTA() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [contactFormSubject, setContactFormSubject] = useState("");

  const openContactForm = (subject: string) => {
    setContactFormSubject(subject);
    setIsContactFormOpen(true);
  };

  return (
    <>
      <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-400 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-400 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-6 px-4 py-2 border-white/30 text-white bg-white/10 backdrop-blur-sm">
              <Award className="w-4 h-4 mr-2" />
              Ready for Investment
            </Badge>

            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Transform Your LLMs Into
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Domain Experts
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12">
              Join the companies already using VRIN to deliver <span className="font-bold text-white">expert-level AI analysis</span> 
              with production-grade reliability. From prototype to IPO-ready infrastructure.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold px-10 py-6 text-xl rounded-full shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = '/auth'}
              >
                <Rocket className="mr-3 h-6 w-6" />
                Start Building Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-bold px-10 py-6 text-xl rounded-full backdrop-blur-sm bg-white/10 transition-all duration-300"
                onClick={() => openContactForm("VC Demo Request")}
              >
                <Calendar className="mr-3 h-6 w-6" />
                Schedule VC Demo
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {ctaFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <Icon className="w-8 h-8 text-yellow-400 mb-3 mx-auto" />
                      <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-blue-100 text-sm">{feature.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Investment Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Investment Opportunity
              </h3>
              <p className="text-blue-100 text-lg">
                Revolutionary AI infrastructure with proven traction and defensible technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {investmentHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {highlight.value}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {highlight.title}
                  </h4>
                  <p className="text-blue-100 text-sm mb-3">
                    {highlight.description}
                  </p>
                  <Badge variant="outline" className="border-yellow-400/50 text-yellow-300 bg-yellow-400/10">
                    {highlight.trend}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="flex items-center justify-center gap-8 mb-8 text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>11 AWS Services Deployed</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>8.5/10 Expert Validation</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>99.9% Production Uptime</span>
              </div>
            </div>

            <p className="text-blue-200 text-lg">
              <span className="font-semibold text-white">Join industry leaders</span> already transforming their AI capabilities with VRIN
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <ContactForm 
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        defaultSubject={contactFormSubject}
      />
    </>
  );
}