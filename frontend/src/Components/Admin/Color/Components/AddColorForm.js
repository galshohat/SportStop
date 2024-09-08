import React, { useState } from 'react';
import "../../Category/Components/Components.css"

const AddColorForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');

    const isButtonDisabled = !name || !value;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isButtonDisabled) {
            onSubmit(name, value);
        }
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
                    <label className="form-label">Value <label style={{fontSize: "13px"}}>( # + Uppercase In Hex 3/6 length )</label></label>
                </div>
                <div className="form-group">
                    <div
                        className="color-preview-circle"
                        style={{
                            backgroundColor: value || '#fff',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            marginLeft: "4vw",
                            marginTop: "1.5vh",
                            border: '1px solid #000'
                        }}
                    />
                </div>
            </div>
            <button type="submit" className="create-btn" disabled={isButtonDisabled}>Add Color</button>
        </form>
    );
};

export default AddColorForm;