"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Hospital, Pill, User } from "lucide-react"

export function UseCases() {
  const [activeTab, setActiveTab] = useState("emergency")

  return (
    <Tabs defaultValue="emergency" className="w-full" onValueChange={setActiveTab}>
      <div className="flex justify-center mb-8">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="emergency" className="data-[state=active]:gradient-bg data-[state=active]:text-white">
            Emergency Department
          </TabsTrigger>
          <TabsTrigger value="pharma" className="data-[state=active]:gradient-bg data-[state=active]:text-white">
            Pharmaceutical
          </TabsTrigger>
          <TabsTrigger value="provider" className="data-[state=active]:gradient-bg data-[state=active]:text-white">
            Healthcare Provider
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="emergency" className="mt-0">
        <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                  <Hospital className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Emergency Department</h3>
                <p className="text-muted-foreground mb-6">
                  When a patient arrives at the ED with chest pain at 11 PM, doctors need immediate access to their
                  medical history.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <p className="text-sm">Instant access to complete medical history</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <p className="text-sm">Critical medication interaction warnings</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <p className="text-sm">Reduce information gathering from 15 minutes to 6 seconds</p>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-6 border border-border/50">
                <h4 className="font-medium mb-3">Example Scenario</h4>
                <div className="space-y-4">
                  <div className="bg-background rounded p-3 border border-border/50">
                    <p className="text-sm font-medium">Doctor Query</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      &ldquo;Tell me about Margaret Chen&apos;s cardiac history and current medications.&rdquo;
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded p-3 border border-primary/10">
                    <p className="text-sm font-medium">Vrin-Powered Response</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      &ldquo;Margaret Chen (58) has a LAD stent placed 3 months ago. Currently on Clopidogrel 75mg daily,
                      Atorvastatin 40mg, and Metformin 1000mg for Type 2 Diabetes (15yr history). Last troponin level
                      was 0.02 ng/mL. Allergic to penicillin.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pharma" className="mt-0">
        <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Pharmaceutical Integration</h3>
                <p className="text-muted-foreground mb-6">
                  Pharmaceutical companies can embed Vrin into their clinical software to enhance medication management
                  and patient outcomes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <p className="text-sm">Seamless API integration with existing clinical software</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <p className="text-sm">Real-time medication efficacy tracking</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <p className="text-sm">40% increase in user engagement with clinical software</p>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-6 border border-border/50">
                <h4 className="font-medium mb-3">Integration Example</h4>
                <div className="space-y-4">
                  <div className="bg-background rounded p-3 border border-border/50">
                    <p className="text-sm font-medium">API Integration</p>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto mt-1">
                      <code>{`// Store clinical interaction
await memoryApi.storeEpisode({
  userId: 'dr_smith_clinic',
  patientId: 'patient_456',
  clinicalData: conversationData,
  drugContext: currentMedications
});`}</code>
                    </pre>
                  </div>
                  <div className="bg-primary/5 rounded p-3 border border-primary/10">
                    <p className="text-sm font-medium">Business Outcome</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      &ldquo;Enhanced clinical software value with continuous real-world evidence generation and improved
                      medication adherence.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="provider" className="mt-0">
        <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Healthcare Provider</h3>
                <p className="text-muted-foreground mb-6">
                  Healthcare providers can use Vrin to maintain continuity of care across multiple specialists and
                  visits.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <p className="text-sm">Consistent patient context across all specialists</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <p className="text-sm">Reduced documentation burden with automated summaries</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <p className="text-sm">67% reduction in patient safety incidents</p>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-6 border border-border/50">
                <h4 className="font-medium mb-3">Clinical Workflow</h4>
                <div className="space-y-4">
                  <div className="bg-background rounded p-3 border border-border/50">
                    <p className="text-sm font-medium">Before Appointment</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      &ldquo;AI assistant automatically prepares a comprehensive patient summary from all previous visits
                      across specialties.&rdquo;
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded p-3 border border-primary/10">
                    <p className="text-sm font-medium">During Appointment</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      &ldquo;Vrin provides real-time clinical decision support with relevant patient history and treatment
                      recommendations.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
