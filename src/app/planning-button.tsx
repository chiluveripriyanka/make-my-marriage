"use client";

import { useRef } from "react";

export default function PlanningButton({ login = false }: { login?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        className={login ? "login-button" : "button"}
        onClick={() => dialog.current?.showModal()}
      >
        {login ? "Log In" : "Start Planning →"}
      </button>
      <dialog
        ref={dialog}
        className="access-dialog"
        aria-label={login ? "Login availability" : "Registration availability"}
      >
        <h2>{login ? "Welcome back" : "Your celebration starts here"}</h2>
        <p>
          {login
            ? "Login is not available yet. We’re preparing your wedding workspace."
            : "Wedding registration is coming soon. In the meantime, explore how your family can plan together."}
        </p>
        <form method="dialog">
          <button className="button">Back to exploring</button>
        </form>
      </dialog>
    </>
  );
}
