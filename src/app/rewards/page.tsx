"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

export default function RewardsPage() {
  const queryClient = useQueryClient();
  const { data: rewards = [], isLoading } = useQuery({ queryKey: ["rewards"], queryFn: () => base44.entities.Reward.list() });
  const { data: kids = [] } = useQuery({ queryKey: ["kids"], queryFn: () => base44.entities.Kid.list() });
  const { data: redemptions = [] } = useQuery({ queryKey: ["redemptions"], queryFn: () => base44.entities.RewardRedemption.list() });
  const { data: logs = [] } = useQuery({ queryKey: ["choreLogs"], queryFn: () => base44.entities.ChoreLog.list("-created_date", 100) });

  const redeem = useMutation({
    mutationFn: async ({ reward, kidId }: { reward: any; kidId: string }) => {
      const kid = kids.find((k: any) => k.id === kidId);
      const kidLogs = logs.filter((l) => l.kid_id === kidId);
      const totalStars = kidLogs
        .filter((l) => l.status === "approved")
        .reduce((sum, l) => sum + l.star_value, 0);

      if (totalStars < reward.cost) {
        throw new Error(`Not enough stars! ${kid?.name} has ${totalStars} stars but needs ${reward.cost}`);
      }

      await base44.entities.RewardRedemption.create({
        reward_id: reward.id,
        reward_title: reward.title,
        kid_id: kidId,
        kid_name: kid?.name || "",
        cost: reward.cost,
      });
      await base44.entities.Notification.create({
        message: `${kid?.name || "Kid"} redeemed ${reward.title} for ${reward.cost} stars!`,
        kid_name: kid?.name || "",
        chore_title: reward.title,
        is_read: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["redemptions"] });
      toast.success("Reward redeemed — notify the kid!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) return <div className="flex justify-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Reward Store</h1>
            <p className="text-sm text-muted-foreground">Set up rewards your kids can earn with stars</p>
          </div>
          <div className="flex gap-2">
            <Link href="/chores"><Button variant="outline">Parent Dashboard</Button></Link>
            <Link href="/kids"><Button variant="outline">Kids</Button></Link>
          </div>
        </div>

        {kids.length === 0 && (
          <div className="bg-secondary/50 rounded-xl p-4 text-sm text-muted-foreground text-center mb-6">
            Add kids first before redeeming rewards.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {rewards.map((r: any) => (
            <Link key={r.id} href={`/rewards/${r.id}`}>
              <div className="card-accent rounded-xl p-4 border border-border hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-bold">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="font-semibold">{r.cost} ⭐</Badge>
                    <div className="mt-2">
                      <select className="border rounded px-2 py-1 text-sm mr-2" defaultValue="" disabled={kids.length===0} id={`kid-select-${r.id}`} onClick={(e) => e.stopPropagation()}>
                        <option value="">Select kid</option>
                        {kids.map((k:any)=> <option key={k.id} value={k.id}>{k.name}</option>)}
                      </select>
                      <Button size="sm" onClick={(e) => {
                        e.preventDefault();
                        const sel = (document.getElementById(`kid-select-${r.id}`) as HTMLSelectElement);
                        if (!sel || !sel.value) { toast.error('Select a kid first'); return; }
                        redeem.mutate({ reward: r, kidId: sel.value });
                    }} disabled={redeem.isPending || kids.length===0 || !kids.find((k: any) => {
                      const kidLogs = logs.filter((l) => l.kid_id === k.id);
                      const totalStars = kidLogs.filter((l) => l.status === "approved").reduce((sum, l) => sum + l.star_value, 0);
                      return totalStars >= r.cost;
                    })}>
                        Redeem
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {redemptions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-display font-bold mb-6">Redemption History</h2>
            <div className="space-y-3">
              {redemptions.map((r: any) => (
                <div key={r.id} className="card-accent rounded-lg p-4 border border-border flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{r.kid_name}</p>
                    <p className="text-sm text-muted-foreground">{r.reward_title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(r.redeemed_date).toLocaleDateString()} at {new Date(r.redeemed_date).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-semibold">{r.cost} ⭐</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
