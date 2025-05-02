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
                    <li key={index}>
                        {resource.link ? (
                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                {resource.title}
                            </a>
                        ) : (
                            <strong>{resource.title}</strong>
                        )}
                        {resource.description && <p>{resource.description}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResourceList;
