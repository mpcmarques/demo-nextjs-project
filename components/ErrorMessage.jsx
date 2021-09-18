import React from "react";
import PropTypes from "prop-types";

const ErrorMessage = ({ error }) => {
  if (error == null) return null;

  return (
    <div className="bg-red-500 p-3 text-white rounded-md my-2 border-2 border-color-red-200">
      Erro: {error.message}
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.object,
};

export default ErrorMessage;
