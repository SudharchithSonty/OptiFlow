/**
 * Schedule visualization utilities for CNC Job Shop Scheduler
 */

// Format time in minutes to human-readable format
function formatTime(minutes) {
    if (!minutes && minutes !== 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

// Get color for a family ID
function getFamilyColor(familyId) {
    const colors = {
        'F1': '#FF6B6B',
        'F2': '#4ECDC4',
        'F3': '#FFE66D',
        'F4': '#95E1D3',
        'F5': '#A66CFF',
        'F6': '#FF9F43'
    };
    return colors[familyId] || '#888888';
}

// Adjust color brightness
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Calculate appropriate time step for axis markers
function calculateTimeStep(maxTime) {
    if (maxTime <= 500) return 60;
    if (maxTime <= 2000) return 200;
    if (maxTime <= 5000) return 500;
    if (maxTime <= 10000) return 1000;
    return 2000;
}

// Format time marker for axis
function formatTimeMarker(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

// Export for use in HTML
window.scheduleUtils = {
    formatTime,
    getFamilyColor,
    adjustColor,
    calculateTimeStep,
    formatTimeMarker
};