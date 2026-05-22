// Local Storage Activity Tracker (User-Scoped)

const STORAGE_KEY_PREFIX = 'user_recent_activities';
const MAX_ACTIVITIES = 10;

/**
 * Get the storage key scoped to a specific user
 * @param {number|string|null} userId - The user's ID
 * @returns {string} The scoped storage key
 */
const getStorageKey = (userId = null) => {
    if (userId) {
        return `${STORAGE_KEY_PREFIX}_${userId}`;
    }
    return STORAGE_KEY_PREFIX;
};

// Track current user ID for scoping
let _currentUserId = null;

/**
 * Set the current user ID for activity scoping
 * @param {number|string|null} userId
 */
export const setCurrentUserId = (userId) => {
    _currentUserId = userId;
};

export const activityTypes = {
    LAGACY_NIN: 'Lagacy NIN',
    FUND_WALLET: 'Fund Wallet',
    BUY_SCRATCH_CARD: 'Buy Scratch Card',
    LOGOUT: 'Logout',
    REPORT_BUG: 'Report Bug',
    UPDATE_PROFILE: 'Update Profile',
    LOGIN: 'Login',
    DOWNLOAD_PDF: 'Download PDF',
    ACCOUNT_SWITCH: 'Account Switch'
};

export const activityStatuses = {
    SUCCESS: 'success',
    PENDING: 'pending',
    FAILED: 'failed',
    COMPLETED: 'completed'
};

/**
 * Add a new activity to local storage
 * @param {string} type - Activity type (from activityTypes)
 * @param {string} description - Activity description
 * @param {string} status - Activity status (from activityStatuses)
 * @param {Object} details - Additional details about the activity
 */
export const addActivity = (type, description, status = activityStatuses.COMPLETED, details = {}) => {
    try {
        // Get existing activities
        const existingActivities = getActivities();
        
        // Create new activity
        const newActivity = {
            id: Date.now() + Math.random(),
            type,
            description,
            status,
            details,
            timestamp: new Date().toISOString(),
            created_at: new Date().toISOString()
        };
        
        // Add new activity to the beginning
        existingActivities.unshift(newActivity);
        
        // Keep only the most recent activities
        const updatedActivities = existingActivities.slice(0, MAX_ACTIVITIES);
        
        // Save to local storage (scoped to current user)
        const key = getStorageKey(_currentUserId);
        localStorage.setItem(key, JSON.stringify(updatedActivities));
        
        return newActivity;
    } catch (error) {
        console.error('Failed to add activity to local storage:', error);
        return null;
    }
};

/**
 * Get all activities from local storage
 * @returns {Array} Array of activities
 */
export const getActivities = () => {
    try {
        const key = getStorageKey(_currentUserId);
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to get activities from local storage:', error);
        return [];
    }
};

/**
 * Get recent activities (limited number)
 * @param {number} limit - Maximum number of activities to return
 * @returns {Array} Array of recent activities
 */
export const getRecentActivities = (limit = 3) => {
    const activities = getActivities();
    return activities.slice(0, limit);
};

/**
 * Clear all activities from local storage
 */
export const clearActivities = () => {
    try {
        const key = getStorageKey(_currentUserId);
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Failed to clear activities from local storage:', error);
        return false;
    }
};

/**
 * Remove activities older than specified days
 * @param {number} days - Number of days to keep activities for
 */
export const cleanupOldActivities = (days = 30) => {
    try {
        const activities = getActivities();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const filteredActivities = activities.filter(activity => {
            const activityDate = new Date(activity.timestamp);
            return activityDate > cutoffDate;
        });
        
        const key = getStorageKey(_currentUserId);
        localStorage.setItem(key, JSON.stringify(filteredActivities));
        return filteredActivities;
    } catch (error) {
        console.error('Failed to cleanup old activities:', error);
        return [];
    }
};

/**
 * Get activity status color for display
 * @param {string} status - Activity status
 * @returns {string} CSS class for status
 */
export const getActivityStatusClass = (status) => {
    switch (status) {
        case activityStatuses.SUCCESS:
        case activityStatuses.COMPLETED:
            return 'success';
        case activityStatuses.PENDING:
            return 'pending';
        case activityStatuses.FAILED:
            return 'failed';
        default:
            return 'pending';
    }
};

/**
 * Format activity date for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date
 */
export const formatActivityDate = (timestamp) => {
    try {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Invalid date';
    }
};

/**
 * Detect and record auth activity from Inertia shared props.
 * Call this on page load / component mount with the auth_activity prop.
 *
 * @param {Object|null} authActivity - The auth_activity prop from Inertia
 *   { type: 'LOGIN'|'LOGOUT'|'ACCOUNT_SWITCH', userId, userEmail, userName, timestamp }
 */
export const detectAndRecordAuthActivity = (authActivity) => {
    if (!authActivity || !authActivity.type) return null;

    const { type, userId, userEmail, userName, timestamp } = authActivity;

    // Set the current user for scoping
    if (userId) {
        setCurrentUserId(userId);
    }

    // Map the server event type to our activity type constants
    const typeMap = {
        'LOGIN': activityTypes.LOGIN,
        'LOGOUT': activityTypes.LOGOUT,
        'ACCOUNT_SWITCH': activityTypes.ACCOUNT_SWITCH,
    };

    const activityType = typeMap[type];
    if (!activityType) return null;

    // Build a human-readable description
    const descriptionMap = {
        'LOGIN': `${userName || 'User'} logged in`,
        'LOGOUT': `${userName || 'User'} logged out`,
        'ACCOUNT_SWITCH': `${userName || 'User'} switched account`,
    };

    const description = descriptionMap[type] || `${type} event`;

    // Prevent duplicate entries: check if this exact event was already recorded
    const existing = getActivities();
    const isDuplicate = existing.some(
        a => a.type === activityType && a.details?.authTimestamp === timestamp
    );
    if (isDuplicate) return null;

    return addActivity(activityType, description, activityStatuses.SUCCESS, {
        userId,
        userEmail,
        userName,
        authTimestamp: timestamp,
    });
};

/**
 * Detect and record logout activity from cookie (used after session is destroyed).
 * Reads the auth_activity cookie set by the server on logout, records the activity,
 * then removes the cookie.
 */
export const detectLogoutFromCookie = () => {
    try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, ...valueParts] = cookie.trim().split('=');
            if (name.trim() === 'auth_activity') {
                const value = decodeURIComponent(valueParts.join('='));
                const activity = JSON.parse(value);
                if (activity && activity.type === 'LOGOUT') {
                    // Set user scope for the logout entry
                    if (activity.userId) {
                        setCurrentUserId(activity.userId);
                    }
                    
                    // Check for duplicate
                    const existing = getActivities();
                    const isDuplicate = existing.some(
                        a => a.type === activityTypes.LOGOUT && a.details?.authTimestamp === activity.timestamp
                    );
                    
                    if (!isDuplicate) {
                        addActivity(
                            activityTypes.LOGOUT,
                            `${activity.userName || 'User'} logged out`,
                            activityStatuses.SUCCESS,
                            {
                                userId: activity.userId,
                                userEmail: activity.userEmail,
                                userName: activity.userName,
                                authTimestamp: activity.timestamp,
                            }
                        );
                    }
                    
                    // Clear the cookie
                    document.cookie = 'auth_activity=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                }
                break;
            }
        }
    } catch (error) {
        console.error('Failed to detect logout from cookie:', error);
    }
};

// Initialize cleanup on module load
cleanupOldActivities(30);

