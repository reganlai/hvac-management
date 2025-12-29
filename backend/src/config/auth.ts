export const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET || 'supersecret';
    return secret.trim();
};
