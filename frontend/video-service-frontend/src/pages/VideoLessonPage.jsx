import React, { useState, useEffect } from 'react';
import { getVideoById, getCompletionStatus, markVideoCompleted } from '../api/videoApi';

const VideoLessonPage = ({ videoId, studentId }) => {
    const [video, setVideo] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [markingComplete, setMarkingComplete] = useState(false);

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch video details and completion status in parallel
                const [videoData, completionData] = await Promise.all([
                    getVideoById(videoId),
                    getCompletionStatus(videoId, studentId)
                ]);

                setVideo(videoData);
                setIsCompleted(completionData?.completed || false);
            } catch (err) {
                setError(err.message || 'Failed to load video');
                console.error('Error fetching video data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (videoId && studentId) {
            fetchVideoData();
        }
    }, [videoId, studentId]);

    const handleMarkComplete = async () => {
        try {
            setMarkingComplete(true);
            await markVideoCompleted(videoId, studentId);
            setIsCompleted(true);
        } catch (err) {
            setError('Failed to mark video as completed');
            console.error('Error marking video complete:', err);
        } finally {
            setMarkingComplete(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Loading video...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>Error: {error}</div>
            </div>
        );
    }

    if (!video) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>Video not found</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{video.title}</h1>

            <div style={styles.videoContainer}>
                <video
                    controls
                    style={styles.video}
                    src={video.videoUrl}
                >
                    Your browser does not support the video tag.
                </video>
            </div>

            <div style={styles.description}>
                <h2 style={styles.descriptionTitle}>Description</h2>
                <p>{video.description}</p>
            </div>

            <div style={styles.actionContainer}>
                <button
                    onClick={handleMarkComplete}
                    disabled={isCompleted || markingComplete}
                    style={{
                        ...styles.button,
                        ...(isCompleted || markingComplete ? styles.buttonDisabled : {})
                    }}
                >
                    {markingComplete ? 'Marking Complete...' : isCompleted ? 'Completed ✓' : 'Mark as Complete'}
                </button>
                {isCompleted && (
                    <span style={styles.completedBadge}>This lesson is completed</span>
                )}
            </div>
        </div>
    );
};

// Basic inline styles
const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333'
    },
    videoContainer: {
        width: '100%',
        marginBottom: '20px',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    video: {
        width: '100%',
        height: 'auto',
        display: 'block'
    },
    description: {
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
    },
    descriptionTitle: {
        fontSize: '20px',
        marginBottom: '10px',
        color: '#333'
    },
    actionContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    button: {
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    },
    buttonDisabled: {
        backgroundColor: '#6c757d',
        cursor: 'not-allowed',
        opacity: 0.6
    },
    completedBadge: {
        color: '#28a745',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#666'
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        borderRadius: '8px',
        border: '1px solid #f5c6cb'
    }
};

export default VideoLessonPage;
