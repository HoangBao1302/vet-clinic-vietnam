// Debug Authentication State Script
// Run this in browser console to debug auth issues

console.log('🔍 Debugging Authentication State...');

// 1. Check localStorage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('📊 Local Storage Data:', {
  hasToken: !!token,
  hasUser: !!user,
  tokenLength: token?.length,
  userData: user ? JSON.parse(user) : null
});

// 2. Check cookies
const cookies = document.cookie.split(';').reduce((acc, cookie) => {
  const [key, value] = cookie.trim().split('=');
  acc[key] = value;
  return acc;
}, {});

console.log('🍪 Cookie Data:', {
  hasTokenCookie: !!cookies.token,
  tokenCookieLength: cookies.token?.length,
  allCookies: cookies
});

// 3. Test API endpoints
async function testAuthEndpoints() {
  console.log('🧪 Testing Auth Endpoints...');
  
  if (!token) {
    console.log('❌ No token found, cannot test endpoints');
    return;
  }

  try {
    // Test token validation
    const validateResponse = await fetch('/api/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('🔐 Token Validation:', {
      status: validateResponse.status,
      ok: validateResponse.ok,
      data: validateResponse.ok ? await validateResponse.json() : await validateResponse.text()
    });

    // Test affiliate check access
    const affiliateResponse = await fetch('/api/affiliate/check-access', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('👤 Affiliate Check Access:', {
      status: affiliateResponse.status,
      ok: affiliateResponse.ok,
      data: affiliateResponse.ok ? await affiliateResponse.json() : await affiliateResponse.text()
    });

    // Test user stats
    const userStatsResponse = await fetch('/api/user/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📈 User Stats:', {
      status: userStatsResponse.status,
      ok: userStatsResponse.ok,
      data: userStatsResponse.ok ? await userStatsResponse.json() : await userStatsResponse.text()
    });

  } catch (error) {
    console.error('❌ Error testing endpoints:', error);
  }
}

// 4. Check current URL and redirect
console.log('🌐 Current URL Info:', {
  href: window.location.href,
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
  redirectParam: new URLSearchParams(window.location.search).get('redirect')
});

// 5. Test navigation
function testNavigation() {
  console.log('🧭 Testing Navigation...');
  
  if (token && user) {
    console.log('✅ Have auth data, testing direct navigation...');
    
    // Try to navigate to affiliate dashboard
    window.location.href = '/affiliate/dashboard';
  } else {
    console.log('❌ No auth data, cannot test navigation');
  }
}

// 6. Check AuthContext state (if available)
if (window.React && window.React.useContext) {
  console.log('⚛️ React Context available');
} else {
  console.log('⚛️ React Context not available in global scope');
}

// Run all tests
testAuthEndpoints();

// Export functions for manual testing
window.AuthDebug = {
  testAuthEndpoints,
  testNavigation,
  token,
  user: user ? JSON.parse(user) : null,
  cookies
};

console.log('✅ Debug script loaded. Use window.AuthDebug.* to run functions manually.');
console.log('💡 Try: window.AuthDebug.testNavigation() to test navigation');
