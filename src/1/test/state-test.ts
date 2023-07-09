import { useState } from "react";

export const useTestSharedState = (initialValue: string) => {

  const [state, setState] = useState(initialValue);

  //   in function below we could have more advance calculation for state
  const updateState = (newState: string) => {
    setState(newState);
  };

  return { state, updateState };
};
