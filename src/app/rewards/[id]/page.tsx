"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function RewardDetailPage() {
  const params = useParams();
  const rewardId = params.id as string;
  const queryClient = useQueryClient();

  const { data: reward, isLoading } = useQuery({
    queryKey: ["reward", rewardId],
    queryFn: async () => {
      const rewards = await base44.entities.Reward.list();
      return rewards.find((r) => r.id === rewardId);
    },
  });

  const { data: kids = [] } = useQuery({
    queryKey: ["kids"],
    queryFn: () => base44.entities.Kid.list(),
  });

  const { data: redemptions = [] } = useQuery({
    queryKey: ["redemptions"],
    queryFn: () => base44.entities.RewardRedemption.list(),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["choreLogs"],
    queryFn: () => base44.entities.ChoreLog.list("-created_date", 1000),
  });

  const redeem = useMutation({
    mutationFn: async (kidId: string) => {
      if (!reward) return;
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
      queryClient.invalidateQueries({ queryKey: ["redemptions"] });
      toast.success("Reward redeemed — notify the kid!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );

  if (!reward)
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/rewards">
            <Button variant="outline" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Rewards
            </Button>
          </Link>
          <p className="text-muted-foreground">Reward not found</p>
        </div>
      </div>
    );

  const rewardRedemptions = redemptions.filter((r: any) => r.reward_id === rewardId);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/rewards">
          <Button variant="outline" className="gap-2 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Rewards
          </Button>
        </Link>

        <div className="card-accent rounded-xl p-8 border border-border mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">{reward.title}</h1>
              <p className="text-lg text-muted-foreground">{reward.description}</p>
            </div>
            <Badge variant="secondary" className="font-semibold text-lg px-4 py-2">
              {reward.cost} ⭐
            </Badge>
          </div>

          {kids.length > 0 && (
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Redeem for a kid:</p>
              <div className="flex flex-wrap gap-2">
                {kids.map((kid: any) => {
                  const kidLogs = logs.filter((l) => l.kid_id === kid.id);
                  const totalStars = kidLogs.filter((l) => l.status === "approved").reduce((sum, l) => sum + l.star_value, 0);
                  const hasEnoughStars = totalStars >= reward.cost;
                  return (
                    <div key={kid.id} className="flex flex-col gap-1">
                      <Button
                        onClick={() => redeem.mutate(kid.id)}
                        disabled={redeem.isPending || !hasEnoughStars}
                      >
                        {hasEnoughStars ? `Redeem for ${kid.name}` : `${kid.name} (${totalStars}/${reward.cost})`}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {rewardRedemptions.length > 0 && (
          <div>
            <h2 className="text-xl font-display font-bold mb-6">
              Redemptions ({rewardRedemptions.length})
            </h2>
            <div className="space-y-3">
              {rewardRedemptions.map((r: any) => (
                <div
                  key={r.id}
                  className="card-accent rounded-lg p-4 border border-border flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{r.kid_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(r.redeemed_date).toLocaleDateString()} at{" "}
                      {new Date(r.redeemed_date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
