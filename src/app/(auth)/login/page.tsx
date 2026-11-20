import AuthForm from "../auth-form";
import { tokenSchema } from "@/server/invitations/validation";
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ invitation?: string }> }) { const query = await searchParams; const token = tokenSchema.safeParse(query.invitation); return <AuthForm mode="login" invitation={token.success ? token.data : undefined} />; }
