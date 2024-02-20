import React, { useState } from "react";
import "./toggleSwitch.css";

type Props = {
  isToggled: boolean;
  toggle: () => void;
};

const ToggleSwitch = ({ isToggled, toggle }: Props) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={isToggled} onChange={toggle} />
      <span className="slider"></span>
    </label>
  );
};

export default ToggleSwitch;