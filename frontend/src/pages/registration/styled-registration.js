import styled from "styled-components";

export const StyledRegistrationWrapper = styled.div`
  background: #191A38;
  background: radial-gradient(at top, rgba(35,32,79,1) 0%, rgba(34,31,76,1) 23%, rgba(29,27,67,1) 48%, rgba(24,23,56,1) 82%, rgba(25,26,56,1) 100%);
`;

export const StyledRegistrationContent = styled.div`
  padding: 50px 0;
  .registration__description {
    max-width: 768px;
    margin: 30px auto 50px;
  }
  .registration-form {
    margin: 0 auto;
    padding: 65px;
    &__content {
      padding: 0 0 5px;
    }
    &__submit-align {
      padding: 20px 0;
      text-align: center;
    }
  }
  .login-with-google {
    margin: 15px 0;
  }
`;

export const StyledRegistrationForm = styled.form`
  .input-group:not(:last-child) {
    margin-bottom: 20px;
  }
`;