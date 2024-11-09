import React from "react";
import { Button as AntButton } from "antd";

const Button = ({ children, ...props }) => {
  return (
    <AntButton type={"text"} {...props}>
      {children}
    </AntButton>
  );
};

export default Button;
