import { type NextPage } from "next";
import DebugView from "@/src/components/test/debug-view";
import { api } from "@/src/utils/api";
import { Separator } from "@/components/ui/separator";

// Testing login api and what is returned, this is all dummy data.
const TestLogin: NextPage = () => {
  const apiLogin = api.authMain.login.useMutation();
  const { isLoading, data, context, error } = apiLogin;

  const handleSubmit = () => {
    const testData = { email: "haydnhinks@outlook.com", password: "123" };
    apiLogin.mutate(testData);
  };

  if (isLoading) return <div>Mutation is loading</div>;

  return (
    <div>
      <p>Trigger login api</p>
      {/* // test content: */}
      <DebugView
        visible={true}
        header={`full object from login api`}
        content={apiLogin}
      ></DebugView>
      <Separator></Separator>
      <button className="d-btn" onClick={handleSubmit}>
        Submit Mutation
      </button>
    </div>
  );
};

export default TestLogin;
