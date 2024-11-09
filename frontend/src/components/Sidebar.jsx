import React from "react";
import { Input } from "antd";
import { InputNumber } from "antd";
import { Slider } from "antd";
import { ColorPicker } from "antd";
import "../styles/sidebar.scss";

function Sidebar({
  lineWidth,
  setLineWidth,
  color,
  setColor,
  setText,
  fontSize,
  setFontSize,
  showSidebar,
  showSidebarText,
}) {
  const onSlideChange = (value) => {
    if (Number.isNaN(value)) {
      return;
    }
    setLineWidth(value);
  };

  return showSidebar ? (
    <div className="sidebar">
      <div className="Slider">
        <div className="label">Width: </div>
        <Slider
          min={1}
          max={10}
          onChange={onSlideChange}
          value={typeof lineWidth === "number" ? lineWidth : 0}
        />
      </div>
      <div className="color-picker">
        <div className="label">Color: </div>
        <ColorPicker
          defaultValue={color}
          onChange={(value) => {
            setColor(value.toHexString());
          }}
        />
      </div>
      {showSidebarText && (
        <>
          <div className="text-info">
            <div className="label">Text: </div>
            <Input
              maxLength={32}
              placeholder="Enter text"
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="text-font-info">
            <div className="label">Font Size: </div>
            <InputNumber
              value={fontSize}
              onChange={(value) => setFontSize(value)}
            />
          </div>
        </>
      )}
    </div>
  ) : null;
}

export default Sidebar;
