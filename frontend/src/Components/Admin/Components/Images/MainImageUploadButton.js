import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

const MainImageUploadButton = ({ handleMainImageUpload }) => (
  <label htmlFor="main-image-upload">
    <Input
      accept="image/jpeg,image/jpg,image/png"
      id="main-image-upload"
      type="file"
      onChange={handleMainImageUpload}
    />
    <Button variant="contained" component="span" color="primary" sx={{textTransform: "none", marginLeft: "3vw"}}>
      Upload Main Image
    </Button>
  </label>
);

export default MainImageUploadButton;