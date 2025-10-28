# Backend Architecture Clarification

**Date**: October 27, 2025
**Issue**: 400 Bad Request errors on chat page
**Status**: ⚠️ **NEEDS CLARIFICATION**

---

## 🐛 Current Issue

Getting 400 errors when trying to use the chat:
```
POST /api/chat/start 400
POST /api/chat 400
Error: 'Query parameter is required'
```

---

## 🏗️ Backend Architecture (Current Understanding)

### Two Separate Backends

**1. RAG/Query Lambda Function URL** ✅
- **URL**: `https://ludeelasqiubh3fxmhtjdzwsou0uundi.lambda-url.us-east-1.on.aws`
- **Purpose**: RAG queries with streaming
- **Expects**:
  ```json
  {
    "query": "Your question",
    "user_id": "uuid",
    "stream": true
  }
  ```
- **Returns**: Streaming SSE response
- **Timeout**: 15 minutes
- **Status**: ✅ Working (configured in `RAG_BASE_URL`)

**2. Chat Conversation API** ⚠️
- **URL**: `https://cg7yind3j5.execute-api.us-east-1.amazonaws.com/dev`
- **Purpose**: Conversation management, session handling
- **Expects**:
  ```json
  {
    "message": "Your message",
    "session_id": "session-uuid",
    "response_mode": "chat|expert|raw_facts"
  }
  ```
- **Timeout**: 30 seconds (API Gateway limit)
- **Status**: ⚠️ Returns 400 or times out

---

## 🤔 Questions to Clarify

### Option 1: Chat Backend Has Lambda URL

Does your chat backend (`/chat` endpoint) also have a Lambda Function URL?

If YES:
- What is the chat Lambda Function URL?
- Does it support streaming?
- Does it expect the same parameters (`message`, `session_id`)?

### Option 2: Chat Should Use RAG Endpoint

Should the chat page use the RAG Lambda URL directly instead of a separate chat API?

If YES:
- We'll modify the chat to send `query` + `user_id` instead of `message` + `session_id`
- Session management would be handled client-side
- Conversation history would need different implementation

### Option 3: Two Different Use Cases

Are these meant for different purposes?
- **Chat**: Quick conversations with session management
- **RAG Query**: Deep analysis with streaming

If YES:
- We keep both endpoints
- Need to fix chat backend timeout issue
- OR migrate chat backend to Lambda Function URL

---

## 🔧 Temporary Fix Applied

**Changed**: `config/api.ts`

```typescript
// RAG API: Lambda Function URL (streaming, no timeout)
RAG_BASE_URL: 'https://ludeelasqiubh3fxmhtjdzwsou0uundi.lambda-url.us-east-1.on.aws'

// Chat API: Reverted to original API Gateway
CHAT_BASE_URL: 'https://cg7yind3j5.execute-api.us-east-1.amazonaws.com/dev'
```

**Also Fixed**: Stuck loading state
- Added `setIsLoading(false)` on mount in `use-chat-session.ts`
- Ensures input field is not disabled on page load

---

## 🚨 Current Status

**Input Field Issue**: FIXED ✅
- Loading state now resets properly on mount
- You should be able to type in the chat input

**400 Error Issue**: NEEDS BACKEND INFO ⚠️
- Chat backend returning 400 Bad Request
- Needs clarification on correct backend architecture

---

## 📝 Next Steps

Please provide:

1. **Chat Backend Details**:
   - Is there a Lambda Function URL for chat?
   - Or should chat use the RAG Lambda URL?
   - What parameters does chat backend expect?

2. **Error Details from Backend Logs**:
   - What is the backend Lambda logging when it returns 400?
   - What parameters is it expecting vs receiving?

3. **Architecture Intent**:
   - Are chat and RAG meant to be separate services?
   - Or should they use the same backend?

Once we know this, we can:
- Configure the correct URLs
- Transform request parameters if needed
- Fix the 400 errors
- Ensure streaming works properly

---

## 🔍 Debug Info to Check

**In Browser Console**:
```javascript
// Check what's being sent
localStorage.getItem('vrin_user')
localStorage.getItem('vrin_api_key')
```

**Expected Output**:
```
🔄 Initializing chat session { hasApiKey: true, hasSavedSession: false, hasSavedMessages: false }
ℹ️ No saved session found, starting fresh
```

This should show the input is now enabled and ready to use.

---

**Status**: Input field fixed ✅, Backend architecture needs clarification ⚠️
