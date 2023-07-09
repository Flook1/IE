import { api } from "@/src/utils/api";
import { useState } from "react";

export const useTestSharedStateQuery = (initialValue: string) => {

  const [state, setState] = useState(initialValue);

const testQuery = api.testData.filterState.useQuery({stringValue: state}, {
    enabled: true
})

  //   in function below we could have more advance calculation for state
  const updateState = (newState: string) => {
    setState(newState);
  };

  return { state, updateState };
};
