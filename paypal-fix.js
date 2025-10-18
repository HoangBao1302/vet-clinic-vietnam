// Fix PayPal Logout Issue
// This script helps identify and fix the logout issue after PayPal payment

console.log('🔧 PayPal Logout Fix Script');

// 1. Enhanced session persistence check
function checkSessionPersistence() {
    console.log('🔍 Checking session persistence...');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const sessionToken = sessionStorage.getItem('token');
    const sessionUser = sessionStorage.getItem('user');
    
    console.log('Storage Check:', {
        localStorage: { token: !!token, user: !!user },
        sessionStorage: { token: !!sessionToken, user: !!sessionUser },
        cookies: document.cookie.includes('token=')
    });
    
    // Check if data is valid
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            console.log('✅ Valid auth data found:', {
                userId: userData.id,
                email: userData.email,
                username: userData.username
            });
            return true;
        } catch (error) {
            console.error('❌ Invalid user data:', error);
            return false;
        }
    }
    
    return false;
}

// 2. Restore session if lost
function restoreSession() {
    console.log('🔄 Attempting to restore session...');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            
            // Re-set cookies
            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
            
            // Re-set sessionStorage as backup
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', user);
            
            console.log('✅ Session restored successfully');
            return true;
        } catch (error) {
            console.error('❌ Error restoring session:', error);
            return false;
        }
    }
    
    console.log('❌ No valid session data to restore');
    return false;
}

// 3. Test API access with current token
async function testAPIAccess() {
    console.log('🌐 Testing API access...');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('❌ No token found');
        return false;
    }
    
    try {
        const response = await fetch('/api/user/stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API access successful');
            console.log('User stats:', data.stats);
            return true;
        } else {
            console.log('❌ API access failed:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ API access error:', error);
        return false;
    }
}

// 4. Fix authentication context
function fixAuthContext() {
    console.log('🔧 Fixing authentication context...');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            
            // Dispatch custom event to notify auth context
            const authEvent = new CustomEvent('authRestore', {
                detail: { token, user: userData }
            });
            window.dispatchEvent(authEvent);
            
            console.log('✅ Auth context fix dispatched');
            return true;
        } catch (error) {
            console.error('❌ Error fixing auth context:', error);
            return false;
        }
    }
    
    return false;
}

// 5. Monitor for PayPal redirect
function monitorPayPalRedirect() {
    console.log('👀 Monitoring for PayPal redirect...');
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order') || urlParams.get('token') || urlParams.get('PayerID');
    
    if (orderId) {
        console.log('✅ PayPal redirect detected, order ID:', orderId);
        
        // Check if session is still intact
        if (checkSessionPersistence()) {
            console.log('✅ Session intact after PayPal redirect');
        } else {
            console.log('❌ Session lost after PayPal redirect, attempting restore...');
            restoreSession();
        }
    } else {
        console.log('ℹ️ No PayPal redirect detected');
    }
}

// 6. Auto-fix function
function autoFix() {
    console.log('🚀 Running auto-fix...');
    
    // Check current state
    const hasSession = checkSessionPersistence();
    
    if (!hasSession) {
        console.log('❌ No valid session found, attempting restore...');
        const restored = restoreSession();
        
        if (restored) {
            console.log('✅ Session restored');
        } else {
            console.log('❌ Could not restore session, user needs to login again');
            return false;
        }
    }
    
    // Test API access
    testAPIAccess();
    
    // Fix auth context
    fixAuthContext();
    
    // Monitor for PayPal redirect
    monitorPayPalRedirect();
    
    return true;
}

// 7. Run diagnostics
function runDiagnostics() {
    console.log('🔍 Running diagnostics...');
    
    console.log('\n📊 Current State:');
    console.log('- URL:', window.location.href);
    console.log('- User Agent:', navigator.userAgent);
    console.log('- Cookies:', document.cookie);
    console.log('- LocalStorage keys:', Object.keys(localStorage));
    console.log('- SessionStorage keys:', Object.keys(sessionStorage));
    
    console.log('\n🔧 Auth State:');
    checkSessionPersistence();
    
    console.log('\n🌐 Network State:');
    testAPIAccess();
}

// Auto-run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(autoFix, 1000);
    });
} else {
    setTimeout(autoFix, 1000);
}

// Export functions for manual use
window.PayPalFix = {
    checkSessionPersistence,
    restoreSession,
    testAPIAccess,
    fixAuthContext,
    monitorPayPalRedirect,
    autoFix,
    runDiagnostics
};

console.log('✅ PayPal Fix Script loaded. Use window.PayPalFix.* to run functions manually.');
