import Link from "next/link";

export default function PlanningButton({ login = false, signedIn = false, hasWedding = false }: { login?: boolean; signedIn?: boolean; hasWedding?: boolean }) {
  if (login && signedIn) return null;
  return (
    <Link
      href={signedIn ? (hasWedding ? "/app" : "/onboarding") : login ? "/login" : "/signup"}
      className={login ? "login-button" : "button"}
    >
      {signedIn ? (hasWedding ? "Go to Dashboard →" : "Complete Wedding Setup →") : login ? "Log In" : "Start Planning →"}
    </Link>
  );
}
