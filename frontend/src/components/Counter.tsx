import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

type CounterProps = {
  from: number;
  to: number;
};

const Counter = ({ from, to }: CounterProps) => {
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = nodeRef.current;

    const controls = animate(from, to, {
      duration: 1,
      onUpdate(value) {
        if(node)
        node.textContent = value.toFixed(0);
      }
    });

    return () => controls.stop();
  }, [from, to]);

  return <p ref={nodeRef} />;
};

export default Counter;
