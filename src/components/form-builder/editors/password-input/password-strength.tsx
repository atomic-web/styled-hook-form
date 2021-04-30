import useTranslation from "next-translate/useTranslation";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { PasswordStrengthProps } from "./types";

const PasswordMeter = styled.div`
  margin: 10px 0px;
  height: 10px;
  background: #f00;
  width: 100%;
  transition-property: width;
  transition-duration: 0.5s;
  clear: both;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const scorePassword = (pass: string) => {
  let score = 0;
  if (!pass) return score;

  let letters: Record<string, number> = {};
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1;
    score += 5.0 / letters[pass[i]];
  }

  let variations: Record<string, boolean> = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  };

  let variationCount = 0;
  for (var check in variations) {
    variationCount += variations[check] == true ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  return parseInt(score.toString());
};

const usePasswordStrength = (password: string) => {
  const { t: T } = useTranslation("form");

  const getStrengthText = (s:number) => {
    if (s > 80) return T("password-input-strength-strong");
    if (s > 60) return T("password-input-strength-good");
    if (s >= 30) return T("password-input-strength-medium");

    return T("password-input-strength-weak");
  };

  const getStrengthColor = (s: number) => {
    if (s > 80) return "#52980D";
    if (s > 60) return "#7FD11B";
    if (s >= 30) return "#FBD959";

    return "#F15151";
  };

  const getStrengthPercent = (s: number): number => {
    if (s > 80) return 100;
    if (s > 60) return 75;
    if (s >= 30) return 50;

    return 25;
  };

  let score = scorePassword(password);
  let [strengthText, setStrengthText] = useState<string>(
    getStrengthText(score)
  );
  let [strengthColor, setStrengthColor] = useState<string>(
    getStrengthColor(score)
  );
  let [strengthPer, setStrengthPer] = useState<number>(
    getStrengthPercent(score)
  );

  useEffect(() => {
    setStrengthText(getStrengthText(score));
    setStrengthColor(getStrengthColor(score));
    setStrengthPer(getStrengthPercent(score));
  }, [score]);

  return [strengthText, strengthColor, strengthPer];
};

const PasswordStrength: React.FC<PasswordStrengthProps> = (
  props: PasswordStrengthProps
) => {
  let { password, onChange } = props;
  const { t: T } = useTranslation("form");

  let [
    passStrengthText,
    passStrengthColor,
    passStrengthPer,
  ] = usePasswordStrength(password);

  useEffect(() => {
    if (passStrengthPer) {
      onChange && onChange((passStrengthPer as unknown) as number);
    }
  }, [passStrengthPer]);

  return (
    <>
      <Wrap>
        {" "}
        <PasswordMeter
          style={{
            width: `${passStrengthPer}%`,
            background: passStrengthColor,
            height: "7px",
            marginBottom: "5px",
          }}
        ></PasswordMeter>
        <span
          style={{
            display: "inline",
            fontWeight: "bold",
            margin: "0px 0px 20px 0px",
          }}
        >
          {T("password-input-strength-label")} :
          <span style={{ fontWeight: "normal" }}> {passStrengthText} </span>
        </span>
      </Wrap>
    </>
  );
};

export default PasswordStrength;
