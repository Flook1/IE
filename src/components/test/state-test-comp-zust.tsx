import { useState } from "react";
import { useTestSharedState } from "./state-test";
import { type NextPage } from "next";
import { useTestStore } from "./state-test-store";

type TestStateCompProp = {
  id: string;
};

export const TestStateZust: NextPage<TestStateCompProp> = ({ id }) => {
  const [inputValue, setInputValue] = useState<string>();

  const [testVal1, updateTestVal1] = useTestStore((state) => [
    state.testVal1,
    state.updateTestVal1,
  ]);

  // set state function
  const btnUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("button update");

    // get value from input
    updateTestVal1(inputValue as string);
  };

  return (
    <>
      <div className="m-4">
        <p>Component ID: {id}</p>
        <p>State: {testVal1}</p>
        <input
          type="text"
          className="border-2 border-yellow-300"
          defaultValue={testVal1}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={(e) => btnUpdate(e)}>button</button>
      </div>
    </>
  );
};
