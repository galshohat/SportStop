import React, { useState } from 'react';
import "../../Category/Components/Components.css"

const AddSizeForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(name, value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        placeholder=" "
                        required
                    />
                    <label className="form-label">Name</label>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="form-input"
                        placeholder=" "
                        required
                    />
                    <label className="form-label">Value</label>
                </div>
            </div>
            <div className="form-submit-container">
                <button type="submit" className="create-btn" disabled={name === "" && value === ""}>Add Size</button>
            </div>
        </form>
    );
};

export default AddSizeForm;