import { useMutation } from "@apollo/react-hooks";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import useInputs from "../../utill/useInputs";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneQueries";

const PhoneLoginContainer: React.FC<RouteComponentProps> = ({ history }) => {
  const [state, onChange] = useInputs({
    countryCode: "+82",
    phoneNumber: ""
  });

  const { phoneNumber, countryCode } = state;

  const [PhoneSignMutation, { loading: mutationLoading }] = useMutation(
    PHONE_SIGN_IN,
    {
      onCompleted({ StartPhoneVerification }) {
        const { ok, error } = StartPhoneVerification;
        if (ok === false) {
          setTimeout(() => {
            history.push({
              pathname: "/verify-phone",
              state: {
                phoneNumber: `${countryCode}${phoneNumber}`
              }
            });
          }, 2000);
          toast.error(`${error}`);
        } else if (ok) {
          toast.success("SMS Sent! Redirecting you...");
          return;
        }
      },
      onError() {
        toast.error("server error, code : 404");
      }
    }
  );

  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const isValid = /^\+[1-9]{1}[0-9]{7,12}$/.test(
      `${countryCode}${phoneNumber}`
    );
    if (isValid) {
      PhoneSignMutation({
        variables: { phoneNumber: `${countryCode}${phoneNumber}` }
      });
      return;
    } else {
      toast.error("Please write a valid phone number");
    }
  };

  return (
    <div>
      <PhoneLoginPresenter
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        onInputChange={onChange}
        onSubmit={onSubmit}
        loading={mutationLoading}
      />
    </div>
  );
};

export default PhoneLoginContainer;
