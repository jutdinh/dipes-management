import React, { useState } from 'react';

function FilterableDate({ label, dateValue, setDateValue }) {
    const [showDateInput, setShowDateInput] = useState(false);

    const toggleDateInput = () => {
        setShowDateInput(!showDateInput);
    };

    return (
        <div>
            <span
                className="toggle-icon"
                onClick={toggleDateInput}
            >
                {showDateInput ? '▲' : '▼'}
            </span>
            {showDateInput && (
                <input
                    id={label}
                    className="date-input"
                    type="date"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                />
            )}
        </div>
    );
}

export default FilterableDate;
