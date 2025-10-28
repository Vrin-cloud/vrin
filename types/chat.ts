// Chat types for VRIN frontend integration
// Based on backend API from vrin-engine

export type ResponseMode = 'chat' | 'expert' | 'raw_facts';
export type MessageRole = 'user' | 'assistant' | 'system';
export type UploadStatus = 'uploaded' | 'processing' | 'completed' | 'failed';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  sources?: SourceDocument[];  // Document-level sources from backend
  metadata?: MessageMetadata;
  expert_analysis?: ExpertAnalysis;
}

export interface FactSource {
  fact: string;
  confidence: number;
  source: string;
}

// Document-level sources (new format from backend)
export interface SampleFact {
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
}

export interface SourceDocument {
  document_name: string;
  document_id: string;
  facts_count: number;
  avg_confidence: number;
  sample_facts: SampleFact[];
}

export interface MessageMetadata {
  constraints_applied?: number;
  facts_retrieved?: number;
  documents_used?: number;  // Number of source documents
  total_facts?: number;  // Total facts used in response
  total_chunks?: number;  // Total vector chunks used
  response_time?: string;
  search_time?: string;  // Search time for RAG retrieval
  temporal_filtering_applied?: boolean;
  reasoning_tokens?: number;  // Reasoning tokens used
  input_tokens?: number;  // Input tokens used
  output_tokens?: number;  // Output tokens used
  total_tokens?: number;  // Total tokens used
  model?: string;  // Model used for response
  thinking_steps?: Array<{  // Thinking steps from reasoning
    step: string;
    description: string;
    icon: string;
  }>;
}

export interface ExpertAnalysis {
  multi_hop_chains?: any[];
  cross_document_patterns?: any[];
  reasoning_chains?: any[];
}

export interface ChatSession {
  session_id: string;
  conversation_turn: number;
  created_at: number;
  last_activity: number;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  message: string;
  session_id?: string;
  include_sources?: boolean;
  response_mode?: ResponseMode;
}

export interface SendMessageResponse {
  session_id: string;
  conversation_turn: number;
  message: string;
  response_mode: ResponseMode;
  sources: SourceDocument[];  // Document-level sources
  metadata: MessageMetadata;
  expert_analysis?: ExpertAnalysis;
}

export interface StartConversationResponse {
  session_id: string;
  message: string;
  initial_context?: string;
}

export interface EndConversationResponse {
  session_id: string;
  message: string;
}

export interface FileUpload {
  upload_id: string;
  filename: string;
  file_type: string;
  file_size: number;
  status: UploadStatus;
  upload_timestamp: number;
  processing_started?: number;
  processing_completed?: number;
  facts_extracted?: number;
  error_message?: string;
  progress?: number;  // 0-100 for UI
}

export interface UploadFileResponse {
  upload_id: string;
  status: UploadStatus;
  filename: string;
  file_type: string;
  file_size: number;
  s3_key: string;
  message: string;
  estimated_processing_time: string;
  status_endpoint: string;
}
