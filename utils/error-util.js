const { ErrorCodes } = require("@/shared/errorCodes");

// pass the response that get from error #error.response
export const getErrorMessage = (error) => {
  console.log("error2");
  console.log(error);
  logError(error.response.data.Message, error.response.data.AdditionalData);
  if (error.response.status >= 400 && error.response.status < 500) {
    switch (error.response.data.ErrorCode) {
      case ErrorCodes.LogginUserDetailsIncorrect:
        return {
          message: "One or more user details incorrect",
        };

      case ErrorCodes.ExisitingUser:
        return {
          message: "User already exsist with provided email",
        };

      default:
        return {
          message: error.response.data.Message,
        };
    }
  } else {
    throw new Error(error.response.data.message || error.response.message);
  }
};

const logError = (message, AdditionaDetails = null) => {
  console.error(`Message: ${message} \n + ${AdditionaDetails} `);
};
