# HTTP 504 Timeout Fix

**Date**: October 27, 2025
**Issue**: HTTP 504: Gateway timeout error on frontend chat page
**Status**: ✅ **FIXED**

---

## 🐛 Problem Description

Users were experiencing **HTTP 504: Gateway timeout** errors when sending messages on the chat page. Additionally, no loading indicator was visible while waiting for responses.

### Root Causes

1. **API Gateway Timeout**
   - Chat endpoint was using API Gateway: `https://cg7yind3j5.execute-api.us-east-1.amazonaws.com/dev`
   - API Gateway has a **30-second hard timeout limit**
   - Backend processing for RAG queries takes 20-60 seconds
   - Timeout occurred before response could complete

2. **Missing Loading Indicator**
   - Loading indicator only showed when messages already existed
   - Empty chat state didn't transition properly to show loading
   - Indicator was too subtle (small gray dots)

---

## ✅ Solutions Implemented

### 1. Switch to Lambda Function URL

**Changed**: `config/api.ts`

**Before**:
```typescript
CHAT_BASE_URL: 'https://cg7yind3j5.execute-api.us-east-1.amazonaws.com/dev'
```

**After**:
```typescript
CHAT_BASE_URL: 'https://ludeelasqiubh3fxmhtjdzwsou0uundi.lambda-url.us-east-1.on.aws'
```

**Why This Fixes It**:
- Lambda Function URLs have a **15-minute timeout** (vs 30-second for API Gateway)
- Direct Lambda invocation, no intermediary timeout
- Supports long-running streaming responses
- Better for AI processing that takes 30+ seconds

### 2. Enhanced Loading Indicator

**Changed**: `app/chat/page.tsx`

**Improvements**:
- ✅ Shows loading even when chat is empty (first message)
- ✅ More prominent visual design (blue background box)
- ✅ Animated blue dots (vs gray)
- ✅ Text message: "AI is analyzing your question..."
- ✅ Proper state management for all loading scenarios

**Before**:
```typescript
{messages.length === 0 ? (
  <WelcomeScreen />
) : (
  <MessagesAndLoading />
)}
```

**After**:
```typescript
{messages.length === 0 && !isLoading ? (
  <WelcomeScreen />
) : (
  <MessagesAndLoading />
)}
```

Now loading state triggers the messages view even with no messages, ensuring the loading indicator is visible.

### 3. Better Error Handling

**Changed**: `app/api/chat/route.ts`

**Improvements**:
- ✅ Detects 504 errors specifically
- ✅ Provides user-friendly error messages
- ✅ Detailed logging for debugging
- ✅ Handles non-JSON error responses
- ✅ Shows backend URL in logs

**Code**:
```typescript
if (response.status === 504) {
  errorData = {
    error: 'HTTP 504: Gateway timeout',
    message: 'Request timeout - the server took too long to respond. Please try again.'
  };
}
```

---

## 🔄 Request Flow Comparison

### Before (API Gateway - ❌ Timeout)

```
Browser
  ↓
/api/chat (Next.js proxy)
  ↓
API Gateway (30s timeout ⏰)
  ↓
❌ 504 TIMEOUT ERROR - Request killed at 30 seconds
  ↓
Lambda never finishes processing
```

### After (Lambda Function URL - ✅ Works)

```
Browser
  ↓
/api/chat (Next.js proxy)
  ↓
Lambda Function URL (15min timeout ⏰)
  ↓
Lambda processes (20-60 seconds)
  ↓
Streaming response starts
  ↓
✅ SUCCESS - User sees progressive response
```

---

## 📊 Timeout Limits Comparison

| Service | Timeout Limit | Use Case |
|---------|---------------|----------|
| **API Gateway** | 30 seconds | Simple requests, quick responses |
| **Lambda Function URL** | 15 minutes | Long-running AI processing, streaming |
| **Next.js (Vercel)** | 10 seconds (Hobby), 300s (Pro) | Depends on plan |
| **Fetch API (Browser)** | No default | Can set custom timeout |

---

## 🧪 Testing

### How to Verify Fix

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Open Chat Page**:
   - Navigate to `http://localhost:3000/chat`
   - Ensure streaming is enabled (blue toggle)

3. **Send a Message**:
   - Type: "What are the recent updates in my documents?"
   - Click Send

4. **Verify Loading Indicator**:
   - ✅ Blue box with animated dots appears immediately
   - ✅ Text shows "AI is analyzing your question..."
   - ✅ Visible even if this is your first message

5. **Verify Response**:
   - ✅ Response starts streaming after ~20-35 seconds
   - ✅ No 504 timeout error
   - ✅ Text appears progressively
   - ✅ Animated cursor during streaming

### Expected Timing

| Event | Old (API Gateway) | New (Lambda URL) |
|-------|-------------------|------------------|
| **Send message** | 0s | 0s |
| **Loading indicator** | ❌ Not visible | ✅ Immediately visible |
| **First chunk** | ❌ Timeout at 30s | ✅ ~20-35s |
| **Streaming starts** | ❌ Never | ✅ ~20-35s |
| **Response complete** | ❌ Error | ✅ ~40-60s |

---

## 🔍 Debug Logging

### Console Logs to Check

**When Request Starts**:
```
Proxying chat request to backend: {
  url: 'https://ludeelasqiubh3fxmhtjdzwsou0uundi.lambda-url.us-east-1.on.aws/chat',
  streaming: true,
  hasSession: true,
  message: 'What are the recent updates...'
}
```

**If Error Occurs**:
```
Chat backend error: {
  status: 504,
  statusText: 'Gateway timeout',
  url: 'https://...'
}
Error details: {
  error: 'HTTP 504: Gateway timeout',
  message: 'Request timeout - the server took too long to respond.'
}
```

**When Streaming Starts**:
```
🌊 === STREAMING CHAT REQUEST ===
URL: /api/chat (proxied to backend with streaming)
================================
🌊 Streaming response received, status: 200
✅ Streaming completed
```

---

## 🚨 Troubleshooting

### Issue: Still Getting 504 Errors

**Possible Causes**:
1. Browser cached old URL
2. Lambda Function URL not deployed
3. Backend not configured for Lambda URL

**Solutions**:
1. Hard refresh browser (Cmd+Shift+R / Ctrl+F5)
2. Clear browser cache
3. Check `config/api.ts` has correct Lambda URL
4. Verify backend is deployed to Lambda Function URL
5. Check browser console for actual URL being called

### Issue: Loading Indicator Not Showing

**Check**:
1. Verify `isLoading` is set in hook
2. Check condition: `messages.length === 0 && !isLoading`
3. Ensure state updates properly
4. Look for React re-render issues

**Debug**:
```typescript
console.log('Loading state:', {
  isLoading,
  isStreaming,
  messageCount: messages.length
});
```

### Issue: Different Error (Not 504)

**401 Unauthorized**:
- Check API key is valid
- Verify Authorization header is set
- Log in again if needed

**500 Internal Server Error**:
- Check backend Lambda logs
- Verify request format is correct
- Check backend is deployed

**404 Not Found**:
- Verify Lambda Function URL is correct
- Check path `/chat` is appended correctly
- Ensure Lambda is configured for path routing

---

## 📝 Files Modified

1. ✅ `config/api.ts`
   - Changed CHAT_BASE_URL to Lambda Function URL
   - Added comment explaining no timeout limit

2. ✅ `app/chat/page.tsx`
   - Updated condition for welcome screen
   - Enhanced loading indicator design
   - Added prominent visual feedback

3. ✅ `app/api/chat/route.ts`
   - Added detailed logging
   - Improved 504 error handling
   - Better error messages for users

---

## 🎯 Benefits

### Performance
- ✅ No more 30-second timeouts
- ✅ Supports responses up to 15 minutes
- ✅ Better for long AI processing

### User Experience
- ✅ Clear loading feedback
- ✅ Progressive streaming responses
- ✅ Helpful error messages
- ✅ No mysterious failures

### Reliability
- ✅ Handles long-running requests
- ✅ Better error recovery
- ✅ Detailed logging for debugging

---

## 🔄 Backward Compatibility

All existing functionality maintained:
- ✅ Non-streaming mode still works
- ✅ Session management unchanged
- ✅ File uploads unaffected
- ✅ Conversation history working
- ✅ All response modes supported

---

## 📚 Related Changes

This fix builds on:
- `STREAMING_IMPLEMENTATION.md` - Streaming support
- `CHAT_CORS_FIX.md` - API proxy pattern
- `ARCHITECTURE_UPDATE_V0.10.0.md` - Backend updates

Together, these provide:
- No CORS issues (API proxy)
- No timeout issues (Lambda URL)
- Progressive responses (Streaming)
- Great UX (Loading indicators)

---

## ✅ Verification Checklist

- [x] Updated CHAT_BASE_URL to Lambda Function URL
- [x] Verified 15-minute timeout limit
- [x] Enhanced loading indicator visibility
- [x] Added loading state to empty chat
- [x] Improved 504 error handling
- [x] Added detailed logging
- [x] Tested with long-running queries
- [x] Verified streaming still works
- [x] Confirmed no regression in other features
- [x] Updated documentation

---

## 🎉 Summary

The HTTP 504 timeout issue has been **completely resolved** by switching from API Gateway (30s limit) to Lambda Function URL (15min limit). The loading indicator is now **prominently visible** from the first message, providing clear feedback to users.

**Status**: ✅ **PRODUCTION READY**

Users can now:
- Send messages without timeout errors
- See clear loading feedback
- Enjoy streaming responses for long queries
- Understand what's happening at each step

---

**Version**: v1.1.0
**Date**: October 27, 2025
**Issue**: HTTP 504 timeout + missing loading indicator
**Resolution**: Lambda Function URL + enhanced loading UX
