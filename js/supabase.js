// ============================================
// SUPABASE 설정
// 아래 두 값을 본인의 Supabase 프로젝트 값으로 교체하세요.
// Project Settings → API 에서 확인 가능합니다.
// ============================================

const SUPABASE_URL = 'https://hlxbgwpibjlkpsajfjqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseGJnd3BpYmpsa3BzYWpmanF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTg4MzIsImV4cCI6MjA5Mzk5NDgzMn0.pgbPgqOCqyN9H8tgnDMtwU9SzX04p90bKN5qOqtt2t4';

// Supabase 클라이언트 생성 (CDN으로 로드된 supabase 글로벌 사용)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 전역으로 노출
window.sb = supabaseClient;

// 키가 설정 안 됐을 때 경고
if (SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
  console.warn('⚠ Supabase 키가 설정되지 않았습니다. js/supabase.js 를 편집해 주세요.');
}
