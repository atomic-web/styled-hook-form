import React from 'react';
import { Button, Timeout } from "grommet";
import { MouseEvent, useEffect, useState } from "react";
import { LongPressButtonProps } from "./types";

const LongPressButton: React.FC<LongPressButtonProps> = (props) => {
  const time = () => new Date();
  const [, setIsIn] = useState(false);
  const [, setDownTime] = useState(0);
  const [/*longPressNotified*/, setLongPressNotified] = useState(false);
  const [, setLastTime] = useState<number>(0);

  let {
    pressCallbackTreshold = 100,
    initialDelay = 500,
    //longPressTreshold = 1000,
    //onLongPress,
    whilePress,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
  } = props;

  let [timerHandle, setTimerHandle] = useState<Timeout>(-1);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    setLongPressNotified(false);    
    setLastTime(time().getTime());
    setTimeout(() => {
      if (timerHandle === -1) {
        let handle = setInterval(() => {
          setLastTime((lt) => {
            let ct = time().getTime();
            if (ct - lt > initialDelay) {
              setIsIn((iin: boolean) => {
                if (iin && whilePress) {
                  whilePress();
                }
                return iin;
              });
            }
            return lt;
          });
        }, pressCallbackTreshold);
        setTimerHandle(handle as unknown as Timeout);
      }
    }, 1);

    onMouseDown && onMouseDown(e);
  };

  const handleMouseUp = (e: MouseEvent<HTMLButtonElement>) => {
    setLastTime((lt) => {
      let ct = time().getTime();
      setDownTime(ct);
      if (ct - lt < pressCallbackTreshold) {
        clearInterval(timerHandle);
      }
      return lt;
    });

    if (timerHandle !== -1) {
      clearInterval(timerHandle);
      setTimerHandle(-1);
    }
    setLastTime(0);
    onMouseUp && onMouseUp(e);
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    setIsIn(true);
    onMouseEnter && onMouseEnter(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    setIsIn(false);
    onMouseLeave && onMouseLeave(e);
  };

  useEffect(() => {
    const mouseUpHandler = () => {
      setTimerHandle((h) => {
        if (h !== -1) {
          clearInterval(h);
        }
        return -1;
      });
    };
    window.addEventListener("mouseup", mouseUpHandler);
    return () => window.removeEventListener("mouseup", mouseUpHandler);
  }, []);

  // useEffect(() => {
  //   let lpHandle = setInterval(() => {
  //     setLastTime((lt) => {
  //       if (longPressNotified || lt === 0 ) {
  //         return lt;
  //       }
  //       let diff = time().getTime() - lt;
  //       if (diff >= longPressTreshold && !longPressNotified) {
  //         setLongPressNotified(true);
  //         onLongPress && onLongPress();
  //       }
  //       return lt;
  //     });

  //     return () => clearInterval(lpHandle);
  //   }, Number.MAX_VALUE);
  // }, []);

  return (
    <Button
      {...props as any}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export { LongPressButton };
