import React from 'react';

const PageHeader = ({ title, description, action }) => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-extrabold mb-2">{title}</h1>
                {description && <p className="text-muted">{description}</p>}
            </div>
            {action && <div>{action}</div>}
        </header>
    );
};

export default PageHeader;
