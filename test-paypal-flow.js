// Test PayPal Payment Flow for anhkim.230923@gmail.com
// This script helps debug the logout issue after PayPal payment

console.log('🔍 Testing PayPal Payment Flow...');

// 1. Check current authentication state
function checkAuthState() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('Current Auth State:', {
        hasToken: !!token,
        hasUser: !!user,
        tokenLength: token?.length || 0,
        userData: user ? JSON.parse(user) : null
    });
    
    return { token, user };
}

// 2. Test login for anhkim.230923@gmail.com
async function testLogin() {
    console.log('🔐 Testing login for anhkim.230923@gmail.com...');
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'anhkim.230923@gmail.com',
                password: 'test123' // Update with correct password
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
            console.log('✅ Login successful');
            console.log('User:', data.user);
            
            // Store auth data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return data;
        } else {
            console.log('❌ Login failed:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        return null;
    }
}

// 3. Test PayPal payment creation
async function testPayPalPayment() {
    console.log('💳 Testing PayPal payment creation...');
    
    try {
        const response = await fetch('/api/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: 'ea-full',
                productName: 'EA ThebenchmarkTrader Full Version',
                amount: 7900000,
                method: 'paypal',
                customerInfo: {
                    name: 'Anh Kim',
                    email: 'anhkim.230923@gmail.com',
                    phone: '0900000000'
                },
                affiliateCode: '' // No affiliate for this test
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.paymentUrl) {
            console.log('✅ PayPal payment created');
            console.log('Payment URL:', data.paymentUrl);
            console.log('Order ID:', data.orderId);
            
            // Store order ID for testing
            localStorage.setItem('paypalOrderId', data.orderId);
            
            return data;
        } else {
            console.log('❌ PayPal payment creation failed:', data.error);
            return null;
        }
    } catch (error) {
        console.error('❌ PayPal payment error:', error);
        return null;
    }
}

// 4. Test session persistence
function testSessionPersistence() {
    console.log('🔄 Testing session persistence...');
    
    // Check if auth data persists after page reload simulation
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        console.log('✅ Session data persists in localStorage');
        
        // Test if auth context can be restored
        try {
            const userData = JSON.parse(user);
            console.log('✅ User data can be parsed:', userData);
            
            // Test token validity
            if (token.length > 50) {
                console.log('✅ Token appears valid');
            } else {
                console.log('⚠️ Token seems too short');
            }
        } catch (error) {
            console.error('❌ Error parsing user data:', error);
        }
    } else {
        console.log('❌ Session data not found');
    }
}

// 5. Test downloads page access
async function testDownloadsAccess() {
    console.log('📥 Testing downloads page access...');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('❌ No token found, cannot test downloads access');
        return;
    }
    
    try {
        const response = await fetch('/api/user/stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Downloads access OK');
            console.log('User stats:', data.stats);
        } else {
            console.log('❌ Downloads access failed:', data.message);
        }
    } catch (error) {
        console.error('❌ Downloads access error:', error);
    }
}

// 6. Simulate PayPal redirect scenario
function simulatePayPalRedirect() {
    console.log('🔄 Simulating PayPal redirect scenario...');
    
    // This simulates what happens when user returns from PayPal
    const paypalOrderId = localStorage.getItem('paypalOrderId');
    
    if (paypalOrderId) {
        console.log('✅ PayPal order ID found:', paypalOrderId);
        
        // Check if auth data is still there
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            console.log('✅ Auth data persists after PayPal redirect');
        } else {
            console.log('❌ Auth data lost after PayPal redirect');
        }
    } else {
        console.log('⚠️ No PayPal order ID found');
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting PayPal Payment Flow Tests...\n');
    
    // 1. Check initial auth state
    console.log('1️⃣ Initial Auth State:');
    checkAuthState();
    
    // 2. Test login
    console.log('\n2️⃣ Testing Login:');
    const loginResult = await testLogin();
    
    if (!loginResult) {
        console.log('❌ Cannot continue without login');
        return;
    }
    
    // 3. Test session persistence
    console.log('\n3️⃣ Testing Session Persistence:');
    testSessionPersistence();
    
    // 4. Test downloads access
    console.log('\n4️⃣ Testing Downloads Access:');
    await testDownloadsAccess();
    
    // 5. Test PayPal payment creation
    console.log('\n5️⃣ Testing PayPal Payment Creation:');
    const paymentResult = await testPayPalPayment();
    
    if (!paymentResult) {
        console.log('❌ Cannot continue without payment creation');
        return;
    }
    
    // 6. Simulate PayPal redirect
    console.log('\n6️⃣ Simulating PayPal Redirect:');
    simulatePayPalRedirect();
    
    console.log('\n✅ All tests completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Use the PayPal payment URL to complete payment');
    console.log('2. Check if user gets logged out after payment');
    console.log('3. Report results back');
}

// Auto-run tests
runAllTests();
