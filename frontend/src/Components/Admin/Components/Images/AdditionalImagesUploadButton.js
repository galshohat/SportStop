import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

const AdditionalImagesUploadButton = ({ handleAdditionalImagesUpload }) => (
  <label htmlFor="additional-images-upload">
    <Input
      accept="image/jpeg,image/jpg,image/png"
      id="additional-images-upload"
      type="file"
      multiple
      onChange={handleAdditionalImagesUpload}
    />
    <Button variant="contained" component="span" color="secondary" sx={{ textTransform: "none", marginRight:"-0.25vw"}}>
      Upload Additional Images (Max 4)
    </Button>
  </label>
);

export default AdditionalImagesUploadButton;