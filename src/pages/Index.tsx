import { Board } from "@/components/Board";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Kanban Task Board | Manage Your Tasks</title>
        <meta name="description" content="A beautiful Kanban-style task management board. Organize tasks with drag-and-drop, track progress across columns, and stay productive." />
      </Helmet>
      <Board />
    </>
  );
};

export default Index;
