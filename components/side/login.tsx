import { useContext, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LoginSvg } from "../svg/main";
import { InteractiveHoverButton } from "../ui/button";
import { matchEmail } from "../global/regex";
import { toast } from "react-toastify";
import { loginWithPass, signUp } from "../actions/login";
import { CookSet } from "../global/cookie";
import { AppContext } from "../context";

export default function Login() {
  const { setIsLogin, setUser } = useContext(AppContext);
  const { t } = useTranslation();
  const [sign, setSign] = useState<"in" | "up">("in");

  const toggleHandler = () => {
    setSign((prev) => (prev === "in" ? "up" : "in"));
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const SignIn = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const email = emailRef.current!.value;
      const password = passwordRef.current!.value;

      const send = async () => {
        try {
          const res = await signUp({ email: email, pass: password });

          if (res.status === 201) {
            toast.error(
              t("Invalid credentials. Please check your email or password.")
            );
          } else {
            CookSet("jwt", res.jwt);
            setUser({ email: email, avatar: res.avatar });
            setIsLogin(true);
            toast.success(t("Login successful!"));
          }
        } catch (error) {
          console.error("Error during sign-up:", error);
          toast.error(
            t("An unexpected error occurred. Please try again later.")
          );
        }
      };

      if (!matchEmail(email)) {
        toast.error(
          t("Please enter a valid email address (e.g., example@example.com).")
        );
        return;
      }

      if (password.length < 8) {
        toast.error(
          t(
            "Your password must be at least 8 characters long and include a mix of letters, numbers, and symbols."
          )
        );
        return;
      }

      send();
    };
    return (
      <motion.div
        key="signin"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6">{t("Sign In")}</h2>
        <form onSubmit={submitHandler}>
          <motion.div
            className="mb-4"
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2">
              {t("Email")}
            </label>
            <input
              ref={emailRef}
              className="w-full p-2 border rounded-lg dark:bg-white/10 dark:border-white/20"
              placeholder={t("Enter your email")}
            />
          </motion.div>
          <motion.div
            className="mb-6"
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-2">
              {t("Password")}
            </label>
            <input
              type="password"
              ref={passwordRef}
              className="w-full p-2 border rounded-lg dark:bg-white/10 dark:border-white/20"
              placeholder={t("Enter your password")}
            />
          </motion.div>
          <motion.div
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <InteractiveHoverButton type="submit" icon={<LoginSvg />}>
              {t("Sign In")}
            </InteractiveHoverButton>
          </motion.div>
        </form>
        <motion.p
          className="mt-4 text-center"
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          {t("Don't have an account?")}{" "}
          <button
            onClick={toggleHandler}
            className="text-blue-500 hover:underline"
          >
            {t("Sign Up")}
          </button>
        </motion.p>
      </motion.div>
    );
  };

  const SignUp = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const email = emailRef.current!.value;
      const password = passwordRef.current!.value;

      const send = async () => {
        try {
          const res = await loginWithPass({ email: email, pass: password });

          if (res.status === 201) {
            toast.error(
              t("Invalid credentials. Please check your email or password.")
            );
          } else {
            CookSet("jwt", res.jwt);
            setUser({ email: email, avatar: res.avatar });
            setIsLogin(true);
            toast.success(t("Login successful!"));
          }
        } catch (error) {
          console.error("Error during sign-up:", error);
          toast.error(
            t("An unexpected error occurred. Please try again later.")
          );
        }
      };

      if (!matchEmail(email)) {
        toast.error(
          t("Please enter a valid email address (e.g., example@example.com).")
        );
        return;
      }

      if (password.length < 8) {
        toast.error(
          t(
            "Your password must be at least 8 characters long and include a mix of letters, numbers, and symbols."
          )
        );
        return;
      }

      send();
    };
    return (
      <motion.div
        key="signup"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6">{t("Sign Up")}</h2>
        <form onSubmit={submitHandler}>
          <motion.div
            className="mb-4"
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-2">
              {t("Email")}
            </label>
            <input
              ref={emailRef}
              className="w-full p-2 border rounded-lg dark:bg-white/10 dark:border-white/20"
              placeholder={t("Enter your email")}
            />
          </motion.div>
          <motion.div
            className="mb-6"
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium mb-2">
              {t("Password")}
            </label>
            <input
              type="password"
              ref={passwordRef}
              className="w-full p-2 border rounded-lg dark:bg-white/10 dark:border-white/20"
              placeholder={t("Enter your password")}
            />
          </motion.div>
          <motion.div
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            <InteractiveHoverButton type="submit" icon={<LoginSvg />}>
              {t("Sign Up")}
            </InteractiveHoverButton>
          </motion.div>
        </form>
        <motion.p
          className="mt-4 text-center"
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          {t("Already have an account?")}{" "}
          <button
            onClick={toggleHandler}
            className="text-blue-500 hover:underline"
          >
            {t("Sign In")}
          </button>
        </motion.p>
      </motion.div>
    );
  };

  return (
    <>
      <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="w-full lg:max-w-[500px] px-5 lg:px-10 py-8 bg-white dark:bg-white/10 backdrop-blur-lg rounded-xl">
          <AnimatePresence mode="wait">
            {sign === "in" ? <SignIn /> : <SignUp />}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
