// Run with: npm run hash-password -- "your-chosen-password"
// Copy the printed hash into server/.env as ADMIN_PASSWORD_HASH.
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-chosen-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nAdd this to server/.env as ADMIN_PASSWORD_HASH:\n');
console.log(hash);
console.log('');