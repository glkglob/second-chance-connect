// Type exports converted to JSDoc comments for documentation purposes

/**
 * @typedef {'SEEKER' | 'EMPLOYER' | 'OFFICER' | 'ADMIN'} UserRole
 * @typedef {'ACTIVE' | 'DRAFT' | 'CLOSED'} JobStatus
 * @typedef {'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED'} ApplicationStatus
 * @typedef {'HOUSING' | 'EDUCATION' | 'HEALTH' | 'LEGAL' | 'OTHER'} ServiceCategory
 */

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} name
 * @property {UserRole} role
 * @property {string} [phone]
 * @property {string} [location]
 * @property {string} [bio]
 * @property {string} [avatar_url]
 * @property {string} created_at
 * @property {string} updated_at
 */

// Export empty object for module compatibility
export {}
