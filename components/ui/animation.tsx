import { ReactNode } from "react";
import { motion } from "framer-motion";

export function MotionXFade({
  children,
  delay = 0.3,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ delay: delay }}
    >
      {children}
    </motion.div>
  );
}
export function MotionMXFade({
  children,
  delay = 0.3,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ delay: delay }}
    >
      {children}
    </motion.div>
  );
}
export function MotionYFade({
  children,
  delay = 0.3,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ delay: delay }}
    >
      {children}
    </motion.div>
  );
}
export function MotionMYFade({
  children,
  delay = 0.3,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ delay: delay }}
    >
      {children}
    </motion.div>
  );
}
