import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
function FilterableDate({ label, dateValue, setDateValue, showDateInput, closePopup }) {
    const { lang, proxy, auth, functions } = useSelector(state => state);
    const clearDate = () => {
        setDateValue(""); 
    }

    return (
        <div className="position-relative">
            {showDateInput && (
                <div className="position-absolute shadow" style={{ top: 0, left: -8, width: "200px",zIndex: 10 }}>
                    <div className="bg-white" style={{ padding: "0.5em", boxShadow: "1px 1px 10px 1px #ccc" }}>
                        <div style={{ position: "relative" }}>
                            <h6 style={{ padding: "0.5em", fontSize: "16px", fontWeight: "bold" }}>{label}</h6>
                            <i 
                                className="fa fa-close" 
                                style={{ display: "block", position: "absolute", right: "0.5em", top: "0.5em", fontSize: 20, color: "#ff6655", cursor: "pointer" }} 
                                onClick={closePopup}
                            />
                        </div><div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                className="form-control"
                                type="date" 
                                value={dateValue}
                                onChange={(e) => setDateValue(e.target.value)}
                                min="2020-01-01" max="2030-12-31"
                                style={{ flex: 1 }}
                            />
                            {dateValue && (
                                <i 
                                    className="fa fa-times-circle ml-2" 
                                    style={{ fontSize: 20, color: "#ff6655", cursor: "pointer" }}
                                    onClick={clearDate}
                                    title={lang["delete"]}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterableDate;
