'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Database, 
  RefreshCw, 
  Search, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  FileText
} from 'lucide-react';
import { useRealKnowledgeGraph } from '../../../hooks/use-knowledge-graph-real';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
  icon: React.ElementType;
}

// Sample healthcare data for demonstration
const sampleRecords = [
  {
    id: 'patient-001',
    type: 'patient_record',
    data: {
      patient_id: 'P001',
      name: 'John Smith',
      age: 45,
      condition: 'Type 2 Diabetes',
      diagnosis_date: '2024-01-15',
      symptoms: ['increased thirst', 'frequent urination', 'fatigue'],
      medications: ['Metformin 500mg', 'Lisinopril 10mg'],
      doctor: 'Dr. Sarah Wilson',
      department: 'Endocrinology'
    }
  },
  {
    id: 'patient-002',
    type: 'patient_record',
    data: {
      patient_id: 'P002',
      name: 'Maria Garcia',
      age: 32,
      condition: 'Hypertension',
      diagnosis_date: '2024-01-20',
      symptoms: ['headaches', 'dizziness', 'chest pain'],
      medications: ['Amlodipine 5mg', 'Hydrochlorothiazide 25mg'],
      doctor: 'Dr. Michael Chen',
      department: 'Cardiology'
    }
  },
  {
    id: 'research-001',
    type: 'research_data',
    data: {
      study_id: 'S001',
      title: 'Diabetes Medication Effectiveness Study',
      findings: 'Metformin shows 85% effectiveness in glucose control',
      publication_date: '2024-01-10',
      authors: ['Dr. Sarah Wilson', 'Dr. James Kumar'],
      department: 'Endocrinology Research'
    }
  }
];

const sampleUpdates = [
  {
    recordId: 'patient-001',
    updates: {
      condition: 'Type 2 Diabetes - Well Controlled',
      new_medication: 'Insulin Glargine 20 units',
      follow_up_date: '2024-02-15',
      notes: 'Patient showing excellent glucose control'
    }
  },
  {
    recordId: 'patient-002',
    updates: {
      condition: 'Hypertension - Improving',
      blood_pressure: '125/80 mmHg',
      lifestyle_changes: 'Started exercise program',
      notes: 'Blood pressure within target range'
    }
  }
];

const sampleQueries = [
  'What medications are most effective for Type 2 Diabetes?',
  'List all patients with cardiovascular conditions',
  'What are the latest research findings on diabetes treatment?',
  'Show treatment outcomes for patients over 40'
];

export function ApiWorkflowSimulator() {
  const {
    data,
    insertRecord,
    updateRecord,
    retrieveAndSummarize,
    isInserting,
    isUpdating,
    isRetrieving,
    retrievalResult,
    refetch
  } = useRealKnowledgeGraph();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedRecord, setSelectedRecord] = useState(sampleRecords[0]);
  const [selectedUpdate, setSelectedUpdate] = useState(sampleUpdates[0]);
  const [selectedQuery, setSelectedQuery] = useState(sampleQueries[0]);
  const [workflowActive, setWorkflowActive] = useState(false);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'insert',
      name: 'Insert Record',
      status: currentStep > 0 ? 'completed' : currentStep === 0 && workflowActive ? 'running' : 'pending',
      description: 'Industry system inserts new record via VRIN API',
      icon: Plus
    },
    {
      id: 'process',
      name: 'Process & Extract',
      status: currentStep > 1 ? 'completed' : currentStep === 1 && workflowActive ? 'running' : 'pending',
      description: 'VRIN engine processes data and creates knowledge graph',
      icon: Database
    },
    {
      id: 'store',
      name: 'Store in Graph DB',
      status: currentStep > 2 ? 'completed' : currentStep === 2 && workflowActive ? 'running' : 'pending',
      description: 'Knowledge graph stored in Neptune database',
      icon: Database
    },
    {
      id: 'update',
      name: 'Update Record',
      status: currentStep > 3 ? 'completed' : currentStep === 3 && workflowActive ? 'running' : 'pending',
      description: 'User posts timestamped update (e.g., diagnosis update)',
      icon: Edit
    },
    {
      id: 'modify',
      name: 'Modify KG',
      status: currentStep > 4 ? 'completed' : currentStep === 4 && workflowActive ? 'running' : 'pending',
      description: 'Knowledge graph updated with temporal context',
      icon: RefreshCw
    },
    {
      id: 'retrieve',
      name: 'Retrieve & Summarize',
      status: currentStep > 5 ? 'completed' : currentStep === 5 && workflowActive ? 'running' : 'pending',
      description: 'Query latest KG and generate AI summary',
      icon: Search
    }
  ];

  const runWorkflow = async () => {
    setWorkflowActive(true);
    setCurrentStep(0);

    try {
      // Step 1: Insert Record
      setCurrentStep(0);
      await new Promise(resolve => setTimeout(resolve, 1500));
      insertRecord({ text: JSON.stringify(selectedRecord) });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Process (simulated)
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Store (simulated)
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Update Record
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateRecord(selectedUpdate);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 5: Modify KG (simulated)
      setCurrentStep(4);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 6: Retrieve & Summarize
      setCurrentStep(5);
      await new Promise(resolve => setTimeout(resolve, 1000));
      retrieveAndSummarize({ query: selectedQuery });
      await new Promise(resolve => setTimeout(resolve, 1500));

      setCurrentStep(6);
      setWorkflowActive(false);
    } catch (error) {
      console.error('Workflow error:', error);
      setWorkflowActive(false);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep(0);
    setWorkflowActive(false);
  };

  const getStepIcon = (step: WorkflowStep) => {
    const Icon = step.icon;
    if (step.status === 'running') {
      return <RefreshCw className="h-5 w-5 animate-spin" />;
    }
    return <Icon className="h-5 w-5" />;
  };

  const getStepColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">API Workflow Simulator</h2>
          <p className="text-sm text-slate-600 mt-1">
            Simulate the complete data lifecycle from insertion to retrieval
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={resetWorkflow}
            disabled={workflowActive}
            variant="outline"
          >
            Reset
          </Button>
          <Button
            onClick={runWorkflow}
            disabled={workflowActive}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            {workflowActive ? 'Running...' : 'Start Workflow'}
          </Button>
        </div>
      </div>

      {/* Workflow Steps */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Workflow Steps</h3>
        <div className="space-y-3">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-3 rounded-lg border ${getStepColor(step.status)}`}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{step.name}</div>
                <div className="text-sm opacity-75">{step.description}</div>
              </div>
              <div className="flex-shrink-0">
                {step.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                {step.status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
              </div>
            </motion.div>
          ))}
        </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample Record */}
        <Card>
          <CardContent className="pt-6">
          <h4 className="font-medium text-slate-900 mb-3">Sample Record to Insert</h4>
          <select
            value={selectedRecord.id}
            onChange={(e) => setSelectedRecord(sampleRecords.find(r => r.id === e.target.value) || sampleRecords[0])}
            className="w-full mb-3 p-2 border border-gray-300 rounded-md"
            disabled={workflowActive}
          >
            {sampleRecords.map(record => (
              <option key={record.id} value={record.id}>
                {record.data.name || record.data.title} ({record.type})
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
            <pre>{JSON.stringify(selectedRecord.data, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>

        {/* Sample Update */}
        <Card>
          <CardContent className="pt-6">
          <h4 className="font-medium text-slate-900 mb-3">Sample Update</h4>
          <select
            value={selectedUpdate.recordId}
            onChange={(e) => setSelectedUpdate(sampleUpdates.find(u => u.recordId === e.target.value) || sampleUpdates[0])}
            className="w-full mb-3 p-2 border border-gray-300 rounded-md"
            disabled={workflowActive}
          >
            {sampleUpdates.map(update => (
              <option key={update.recordId} value={update.recordId}>
                Update for {update.recordId}
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
            <pre>{JSON.stringify(selectedUpdate.updates, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>

        {/* Sample Query */}
        <Card>
          <CardContent className="pt-6">
          <h4 className="font-medium text-slate-900 mb-3">Sample Query</h4>
          <select
            value={selectedQuery}
            onChange={(e) => setSelectedQuery(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded-md"
            disabled={workflowActive}
          >
            {sampleQueries.map(query => (
              <option key={query} value={query}>
                {query}
              </option>
            ))}
          </select>
          {retrievalResult && (
            <div className="text-xs text-slate-600 bg-green-50 p-2 rounded border border-green-200">
              <div className="font-medium text-green-800 mb-1">Query Result:</div>
              <pre>{JSON.stringify(retrievalResult, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Graph State */}
      <Card>
        <CardContent className="pt-6">
        <h4 className="font-medium text-slate-900 mb-3">Current Knowledge Graph State</h4>
        {data ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.data?.nodes?.length || 0}</div>
              <div className="text-sm text-slate-600">Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.data?.edges?.length || 0}</div>
              <div className="text-sm text-slate-600">Edges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.data?.triples?.length || 0}</div>
              <div className="text-sm text-slate-600">Triples</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {data.data?.statistics?.temporal?.recentUpdates || 0}
              </div>
              <div className="text-sm text-slate-600">Recent Updates</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            No data available. Start the workflow to see real-time updates.
          </div>
        )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
} 