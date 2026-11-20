import AuthForm from "../auth-form";
import { tokenSchema } from "@/server/invitations/validation";
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ invitation?: string }> }) { const query = await searchParams; const token = tokenSchema.safeParse(query.invitation); return <AuthForm mode="signup" invitation={token.success ? token.data : undefined} />; }
