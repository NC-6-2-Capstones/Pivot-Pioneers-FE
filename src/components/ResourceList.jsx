import React from 'react';

const ResourceList = ({ resources, loading }) => {
    if (loading) return <p>Loading resources...</p>;

    if (!resources || resources.length === 0) {
        return <p>No resources available yet.</p>;
    }

    return (
        <div>
            <h3>Resources</h3>
            <ul>
                {resources.map((resource, index) => (
                    <li key={index} style={{ marginBottom: '1.5em' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                            <span role="img" aria-label="video">🎬</span>
                            <strong>{resource.title}</strong>
                            {resource.link && (
                                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                    <button style={{ marginLeft: '0.5em' }}>Watch Now</button>
                                </a>
                            )}
                        </div>
                        {resource.description && <p>{resource.description}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResourceList;
