import React from 'react';
import Popup from '../Helpers/PopUp/PopUp';
import PacMan from "../Profile-photos/pacman.png";
import Smiley from "../Profile-photos/smiley.png";
import Person from "../Profile-photos/person.png";
import Shower from "../Profile-photos/shower.png";
import './ProfileImagePopup.css'
const ProfileImagePopup = ({ isOpen, onClose, onSelect }) => {

  const handleImageSelect = async (image) => {
    await onSelect(image);
    onClose()
  };

  if (!isOpen) return null;

  return (
    <Popup onClose={onClose} title="Select a Profile Picture" isX={true}>
      <div className="profile-image-popup-content">
        
          <div className="profile-options roomy-profile-options">
            <img src={PacMan} alt="PacMan" onClick={() => handleImageSelect(PacMan)} />
            <img src={Smiley} alt="Smiley" onClick={() => handleImageSelect(Smiley)} />
            <img src={Person} alt="Person" onClick={() => handleImageSelect(Person)} />
            <img src={Shower} alt="Shower" onClick={() => handleImageSelect(Shower)} />
          </div>
      </div>
    </Popup>
  );
};

export default ProfileImagePopup;