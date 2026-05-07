// Local Storage Activity Tracker

const STORAGE_KEY = 'user_recent_activities';
const MAX_ACTIVITIES = 10;

export const activityTypes = {
    LAGACY_NIN: 'Lagacy NIN',
    FUND_WALLET: 'Fund Wallet',
    BUY_SCRATCH_CARD: 'Buy Scratch Card',
    LOGOUT: 'Logout',
    REPORT_BUG: 'Report Bug',
    UPDATE_PROFILE: 'Update Profile',
    LOGIN: 'Login',
    DOWNLOAD_PDF: 'Download PDF'
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
        
        // Save to local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities));
        
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
        const stored = localStorage.getItem(STORAGE_KEY);
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
        localStorage.removeItem(STORAGE_KEY);
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
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredActivities));
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

// Initialize cleanup on module load
cleanupOldActivities(30);
