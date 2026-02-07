// Chat types for VRIN frontend integration
// Based on backend API from vrin-engine

export type ResponseMode = 'chat' | 'expert' | 'raw_facts' | 'brainstorm';
export type QueryDepth = 'thinking' | 'research';  // Optional upgrade modes (null/undefined = default VRIN)
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
  attachments?: FileAttachment[];  // File attachments for user messages
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
  reasoning_summary?: string;  // GPT-5 reasoning summary (thinking process)
  thinking_steps?: Array<{  // Thinking steps from reasoning
    step: string;
    description: string;
    icon: string;
  }>;
  sources?: any[];  // Source documents
  entities?: string[];  // Discovered entities
  chunks_retrieved?: number;  // Number of chunks retrieved
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
  query_depth?: QueryDepth | null;  // Optional: 'thinking' or 'research' (null = default VRIN)
  web_search_enabled?: boolean;
  conversation_upload_ids?: string[];  // Upload IDs for temporary docs in this conversation
  model?: string;  // LLM model to use (validated against user's plan)
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
  saveToMemory?: boolean;  // If true, save to VRIN Knowledge Graph; if false, temporary chat only
}

// Staged file before upload (local state only)
export interface StagedFile {
  id: string;  // Temporary client-side ID
  file: File;
  filename: string;
  file_size: number;
  file_type: string;
  saveToMemory: boolean;  // Default true - save to knowledge graph
}

// File attachment shown in chat messages
export interface FileAttachment {
  id: string;
  filename: string;
  file_type: string;  // MIME type
  file_size: number;
  upload_id?: string;  // Associated upload ID if uploaded
  status: 'uploading' | 'processing' | 'ready' | 'error';  // Processing status
  error_message?: string;  // Error message if status is 'error'
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
