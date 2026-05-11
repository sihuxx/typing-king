// ============================================
// AUTH 헬퍼 — 로그인 상태 관리, 헤더 UI
// ============================================

const Auth = {
  user: null,
  profile: null,

  async getCurrentUser() {
    const { data: { user } } = await window.sb.auth.getUser();
    this.user = user;
    if (user) {
      await this.loadProfile();
    }
    return user;
  },

  async loadProfile() {
    if (!this.user) return null;
    const { data, error } = await window.sb
      .from('profiles')
      .select('*')
      .eq('id', this.user.id)
      .single();
    if (error && error.code !== 'PGRST116') {
      console.error('Profile load error:', error);
    }
    this.profile = data;
    return data;
  },

  async signUp(email, password, nickname) {
    const { data, error } = await window.sb.auth.signUp({ email, password });
    if (error) return { error };
    if (data.user) {
      const { error: profileError } = await window.sb
        .from('profiles')
        .insert({ id: data.user.id, nickname });
      if (profileError) return { error: profileError };
    }
    return { data };
  },

  async signIn(email, password) {
    const { data, error } = await window.sb.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async signInWithGoogle() {
    const { data, error } = await window.sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/index.html' }
    });
    return { data, error };
  },

  async signOut() {
    await window.sb.auth.signOut();
    this.user = null;
    this.profile = null;
    const inPages = window.location.pathname.includes('/pages/');
    window.location.href = (inPages ? '../' : '') + 'index.html';
  },

  isLoggedIn() {
    return !!this.user;
  }
};

window.Auth = Auth;

// ============================================
// 공통 헤더 렌더링
// ============================================

function renderHeader(activePage = 'play') {
  const isLoggedIn = Auth.isLoggedIn();
  const nickname = Auth.profile?.nickname || 'GUEST';

  // pages/ 폴더 안인지 감지하여 경로 접두사 결정
  const inPages = window.location.pathname.includes('/pages/');
  const root = inPages ? '../' : '';
  const pages = inPages ? '' : 'pages/';

  return `
    <a href="${root}index.html" class="logo">TYPING.KING</a>
    <nav class="nav">
      <a href="${root}index.html" class="${activePage === 'play' ? 'active' : ''}">PLAY</a>
      <a href="${pages}ranking.html" class="${activePage === 'ranking' ? 'active' : ''}">RANKING</a>
      ${isLoggedIn ? `<a href="${pages}mypage.html" class="${activePage === 'mypage' ? 'active' : ''}">MY PAGE</a>` : ''}
    </nav>
    <div class="header-right">
      ${isLoggedIn
        ? `<div class="user-badge"><span class="dot"></span>${nickname} · <a href="#" id="btnLogout">LOGOUT</a></div>`
        : `<div class="user-badge guest"><span class="dot"></span>GUEST · <a href="${pages}login.html">LOGIN</a></div>`
      }
      <button class="theme-toggle" id="themeToggle" aria-label="테마 전환">☀</button>
    </div>
  `;
}

async function initHeader(activePage) {
  await Auth.getCurrentUser();
  const header = document.getElementById('header');
  if (header) {
    header.innerHTML = renderHeader(activePage);

    // 로그아웃 버튼
    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', e => {
        e.preventDefault();
        Auth.signOut();
      });
    }

    // 테마 토글
    initThemeToggle();
  }
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  const savedTheme = localStorage.getItem('typing-theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀' : '☾';
  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'dark' ? '☀' : '☾';
    localStorage.setItem('typing-theme', next);
  });
}

// ============================================
// TOAST 알림
// ============================================

function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast' + (type === 'error' ? ' error' : '');
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 2500);
}

window.showToast = showToast;
window.initHeader = initHeader;
