import { User } from "@/entities/user/model/types";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-sm text-muted-foreground">@{user.username}</p>
      <p className="mt-2 text-sm">{user.email}</p>
      <p className="mt-1 text-xs text-muted-foreground">{user.company.name}</p>
    </div>
  );
}