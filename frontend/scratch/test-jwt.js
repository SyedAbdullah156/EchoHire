const { jwtVerify } = require('jose');

async function test() {
  const SECRET = new TextEncoder().encode('super_secret_echo_hire_key_2024');
  const token = 'YOUR_TOKEN_HERE'; // I can't get this easily
  
  try {
    const { payload } = await jwtVerify(token, SECRET);
    console.log('Success:', payload);
  } catch (e) {
    console.error('Failure:', e.message);
  }
}
