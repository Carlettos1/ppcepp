const secret = process.env.JWT_SECRET;

if (!secret || Buffer.byteLength(secret) < 32 || secret === 'your_secret_key') {
    throw new Error('Set JWT_SECRET to a random secret of at least 32 bytes in the backend environment');
}

module.exports = secret;
