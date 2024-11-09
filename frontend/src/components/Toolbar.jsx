import React, { forwardRef } from "react";
import { downloadImage, redo, resetCanvas, undo } from "../utils/tools";
import Button from "./Button";
import { GoPencil } from "react-icons/go";
import { PiRectangle } from "react-icons/pi";
import { FaRegCircle } from "react-icons/fa6";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { CgShapeRhombus } from "react-icons/cg";
import { MdOutlineFormatColorText } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";
import { FaArrowRight, FaUndo, FaRedo } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import "../styles/toolbar.scss";
import { TOOLS } from "../constants/tools";

const Toolbar = forwardRef(
  (
    {
      drawings,
      undoStack,
      redoStack,
      setTool,
      setShowSidebar,
      setShowSidebarText,
      redrawCanvas,
    },
    ref
  ) => {
    const onClickUtilHandler = (utilFn) => {
      utilFn(drawings, undoStack, redoStack, redrawCanvas);
    };

    const onClickHandler = (text) => {
      setTool(text);
      setShowSidebar(true);
      setShowSidebarText(text === TOOLS.TEXT);
    };
    return (
      <div className="toolbar">
        <Button onClick={() => onClickHandler(TOOLS.PENCIL)}>
          <GoPencil />
        </Button>
        <Button onClick={() => onClickHandler(TOOLS.RECTANGLE)}>
          <PiRectangle />
        </Button>
        <Button onClick={() => onClickHandler(TOOLS.CIRCLE)}>
          <FaRegCircle />
        </Button>
        <Button onClick={() => onClickHandler(TOOLS.LINE)}>
          <MdOutlineHorizontalRule />
        </Button>
        <Button onClick={() => onClickHandler(TOOLS.ARROW)}>
          <FaArrowRight />
        </Button>
        <Button onClick={() => onClickHandler(TOOLS.RHOMBUS)}>
          <CgShapeRhombus />
        </Button>
        <Button onClick={() => onClickHandler(TOOLS.TEXT)}>
          <MdOutlineFormatColorText />
        </Button>
        <Button onClick={() => onClickUtilHandler(resetCanvas)}>
          <GrPowerReset />
        </Button>
        <Button onClick={() => onClickUtilHandler(undo)}>
          <FaUndo />
        </Button>
        <Button onClick={() => onClickUtilHandler(redo)}>
          <FaRedo />
        </Button>
        <Button onClick={() => downloadImage(ref)}>
          <FaDownload />
        </Button>
      </div>
    );
  }
);

export default Toolbar;
