import React, { useContext, useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Checkbox from "rc-checkbox";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";

import { UserAccountContext } from "../../pages/account/account.component";
import GoogleTwoFactorsAuth from "../../components/google-auth/google-two-factors-auth.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { SET_AUTHENTICATOR_SECRET, GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { GET_USER_ACCOUNT_DETAILS } from "../../graphql/queries/account.query";

const AccountConfigSecurity = () => {
  const { user } = useContext(UserAccountContext);
  const [visible, setVisible] = useState(false);
  const [twoFactor, setTwoFactor] = useState(user.googleAuthenticatorSecret);

  const client = useApolloClient();

  const { userId, userRole } = client.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  const [setAuthenticatorSecret, { loading }] = useMutation(
    SET_AUTHENTICATOR_SECRET,
    {
      onCompleted: () => {
        closableNotificationWithClick(
          "Two-facto authentication " +
          (twoFactor ? "On" : "Off"),
          "success"
        );
      },
      refetchQueries: [
        {
          query: GET_USER_ACCOUNT_DETAILS,
          variables: { id: `/api/${userRole}s/${userId}` },
          fetchPolicy: "network-only"
        }
      ]
    }
  );

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="35px" />;

  const onChange = (event) => {
    setVisible(true);
    setTwoFactor(event.target.checked);
  };

  return (
    <>
      {visible && (
        <GoogleTwoFactorsAuth
          visible={visible}
          setVisible={setVisible}
          setAuthenticatorSecret={setAuthenticatorSecret}
          user={user}
          twoFactor={twoFactor}
        />
      )}
      <h3 className="security-title">Two-facto authentication</h3>
      <AlertMessage
        type="info"
        margin="15px 0"
        className="security-description"
        message={
          <>
            <p>Use the app for Two-facto authentication.</p>
            <p>
              Authenticator is a 6 or 8 digit disposable digital
              the password that the user must provide in addition to
              username and password to sign in to your account.
            </p>
            <b>
              You can install Google Authenticator on your smartphone from the store
              applications: {" "}
            </b>
            <ul>
              <li>
                <a
                  className="default-link"
                  href="https://apps.apple.com/ru/app/google-authenticator/id388497605"
                  target="_blank"
                  rel="noreferrer"
                >
                  Apple App Store;
                </a>
              </li>
              <li>
                <a
                  className="default-link"
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ru"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Play Market.
                </a>
              </li>
            </ul>
          </>
        }
      />
      {!user.googleAuthenticatorSecret ? (
        <AlertMessage
          type="warning"
          margin="15px 0"
          message="Two-facto Verification is not used"
        />
      ) : (
        <AlertMessage
          type="success"
          margin="15px 0"
          message="Two-facto Verification Enabled"
        />
      )}
      <div className="use-security">
        <Checkbox
          id="googleAuth"
          className="default-checkbox"
          checked={!!user.googleAuthenticatorSecret}
          onChange={onChange}
          name="checkedB"
        />
        <label htmlFor="googleAuth">Use to sign in to your account</label>
      </div>
      {user.googleAuthenticatorSecret && (
        <div className="security-code">
          <h4>{user.googleAuthenticatorSecret}</h4>
          <p>
            Your secret code, use it in the Google Authenticator app.
          </p>
          <LazyLoadImage
            className="google-auth__image"
            src={user.googleAuthQrCode}
            alt={user.googleAuthenticatorSecret}
          />
        </div>
      )}
    </>
  );
};

export default AccountConfigSecurity;
