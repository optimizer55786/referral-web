import { useGlobal } from "reactn";

const useQuantum = () => {
  const [show, setShow] = useGlobal("quantumShowModal");
  // eslint-disable-next-line no-unused-vars
  const [question, setQuestion] = useGlobal("quantumQuestion");

  const isVisible = show;

  const ask = (question) => {
    setQuestion(question);
    setShow(true);
  };

  const close = () => {
    setQuestion("");
    setShow(false);
  };

  return { question, isVisible, ask, close };
};

export default useQuantum;
