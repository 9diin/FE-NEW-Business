# Implementation Plan - Gemini AI Key Registration

This plan outlines the implementation of the Gemini AI Key registration feature, including the UI Dialog, API communication, and UX handling for logged-in/logged-out states.

## User Review Required

> [!IMPORTANT]
> **UX Decision for Logged-out Users**:
> I propose **hiding** the "Gemini AI Key 설정" 버튼 completely when the user is not logged in. This keeps the header clean and focuses the user on logging in first. If you prefer it to be visible but disabled, please let me know.
>
> **API Endpoint**:
> I will create a new API function that sends a `POST` request to `/users/api-keys/gemini` (or similar). If your Python backend uses a specific endpoint for this, please provide the exact URL path.

## Proposed Changes

---

### 1. API Layer for API Keys

#### [NEW] [`src/apis/keys.ts`](file:///Users/goorm_fullstack/Desktop/FE-NEW-Business/src/apis/keys.ts)
- Create a new API module for managing AI keys.
- Add `registerGeminiKeyApi(key: string)` which sends a POST request to the backend.
- Export this from `src/apis/index.ts`.

---

### 2. UI Components

#### [NEW] [`src/components/common/ApiKeyModal.tsx`](file:///Users/goorm_fullstack/Desktop/FE-NEW-Business/src/components/common/ApiKeyModal.tsx)
- Create a Shadcn UI Dialog component.
- **Title**: Gemini AI Key 등록
- **Description/UX Text**: "현재는 Gemini AI Key 등록만 지원합니다. 추후 ChatGPT(OpenAI) 및 Claude(Anthropic) 모델에 대한 키 등록 기능도 추가될 예정입니다."
- **Input**: A password-type or text-type input for the API key.
- **Actions**: "취소", "등록" 버튼.
- Handles validation (empty check) and loading state during API call.
- Upon success, calls an `onSuccess` callback and closes the modal.

---

### 3. App Header Integration

#### [MODIFY] [`src/components/common/app-header.tsx`](file:///Users/goorm_fullstack/Desktop/FE-NEW-Business/src/components/common/app-header.tsx)
- Conditionally render the "Gemini AI Key 설정" button only if `currentUser` exists.
- Add state `isApiKeyModalOpen` and `isKeyRegistered`.
- Change button text from "Gemini AI Key 설정" to "Gemini Key 등록완료" (with a different visual style, e.g., solid green or disabled look) when `isKeyRegistered` is true.
- Integrate `<ApiKeyModal />`.

## Verification Plan
1. Ensure the key button is hidden when logged out.
2. Ensure clicking the button opens the new modal with the correct UX text.
3. Test the API call (mocking if backend is not ready) and verify the header button updates to "등록완료" upon success.
