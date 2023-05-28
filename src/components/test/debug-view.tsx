import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { NextPage } from "next";

type DebugViewProp = {
  visible: boolean;
  header: string;
  content: string | object;
};

const DebugView: NextPage<DebugViewProp> = ({ visible, header, content }) => {
  return (
    <Accordion type="single" collapsible className={!!visible ? " " : "hidden"}>
      <AccordionItem value="test">
        <AccordionTrigger>
          {header}
          <p className="text-xs"></p>
        </AccordionTrigger>
        <AccordionContent>
          {/* If string */}
          {typeof content !== "object" && <p>{content}</p>}
          {typeof content === "object" && (
            <pre>{JSON.stringify(content, null, " ")}</pre>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DebugView;
