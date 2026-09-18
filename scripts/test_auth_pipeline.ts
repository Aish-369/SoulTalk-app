async function testAuthPipeline() {
  const baseUrl = 'http://127.0.0.1:3000';
  const testEmail = `auth_test_${Date.now()}@soultalk.app`;
  const testPassword = 'Password123!';
  const testName = 'Test User';

  console.log('===========================================================');
  console.log(' AUTHENTICATION PIPELINE LIVE END-TO-END VERIFICATION');
  console.log('===========================================================');

  try {
    // 1. Register
    console.log('\n1. Testing Registration (/api/auth/register)...');
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
        companion_name: 'Wolfie',
        companion_type: 'wolfie_guardian',
        personality_type: 'Gentle Friend',
        language: 'mr'
      })
    });
    const regData = await regRes.json();
    console.log('Registration Status:', regRes.status, 'Success:', regData.success, 'Token provided:', Boolean(regData.access_token || regData.token));

    // 2. Login
    console.log('\n2. Testing Login (/api/auth/login)...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.access_token || loginData.token;
    const refreshToken = loginData.refresh_token;
    console.log('Login Status:', loginRes.status, 'Success:', loginData.success, 'Token provided:', Boolean(token));

    // 3. Authenticated API call
    console.log('\n3. Testing Authenticated Call (/api/auth/me)...');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    console.log('Me Status:', meRes.status, 'User Email:', meData.user?.email);

    // 4. Authenticated Protected Endpoint (/api/companion/memories)
    console.log('\n4. Testing Protected DB Endpoint with Token (/api/companion/memories)...');
    const memRes = await fetch(`${baseUrl}/api/companion/memories`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const memData = await memRes.json();
    console.log('Memories Status:', memRes.status, 'Memories Array:', Array.isArray(memData.memories));

    // 5. Refresh Token
    console.log('\n5. Testing Token Refresh (/api/auth/refresh)...');
    const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    const refreshData = await refreshRes.json();
    const refreshedToken = refreshData.access_token;
    console.log('Refresh Status:', refreshRes.status, 'Success:', refreshData.success, 'New Token provided:', Boolean(refreshedToken));

    // 6. Logout
    console.log('\n6. Testing Logout (/api/auth/logout)...');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshedToken}`
      }
    });
    const logoutData = await logoutRes.json();
    console.log('Logout Status:', logoutRes.status, 'Success:', logoutData.success);

    // 7. Login again
    console.log('\n7. Testing Login Again (/api/auth/login)...');
    const loginAgainRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginAgainData = await loginAgainRes.json();
    console.log('Login Again Status:', loginAgainRes.status, 'Success:', loginAgainData.success);

  } catch (e) {
    console.error('Auth verification error:', e);
  }
}

testAuthPipeline();
