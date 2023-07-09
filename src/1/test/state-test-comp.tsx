import { useState } from "react";
import { useTestSharedState } from "./state-test";
import { type NextPage } from "next";

type TestStateCompProp = {
  id: string;
};

export const TestStateComp: NextPage<TestStateCompProp> = ({ id }) => {
  const [inputValue, setInputValue] = useState<string>();

  // const {state, updateState} = useTestSharedState("something");
  const stateTest = useTestSharedState("something");

  //   in function below we could have more advance calculation for state

  // set state function
  const btnUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("button update");

    // get value from input
    stateTest.updateState(inputValue as string);
  };

  return (
    <>
      <div className="m-4">
        <p>Component ID: {id}</p>
        <p>State: {stateTest.state}</p>
        <input type="text" className="border-2 border-yellow-300" onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={(e) => btnUpdate(e)}>button</button>
      </div>
    </>
  );
};
