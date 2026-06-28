"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Star, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import KidAvatar from "@/components/KidAvatar";

export default function KidsPage() {
  const queryClient = useQueryClient();
  const { data: kids = [], isLoading: kidsLoading } = useQuery({
    queryKey: ["kids"],
    queryFn: () => base44.entities.Kid.list(),
  });
  const { data: logs = [] } = useQuery({
    queryKey: ["choreLogs"],
    queryFn: () => base44.entities.ChoreLog.list("-created_date", 100),
  });
  const { data: redemptions = [] } = useQuery({
    queryKey: ["redemptions"],
    queryFn: () => base44.entities.RewardRedemption.list(),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });

  const addKid = useMutation({
    mutationFn: (data: { name: string }) => base44.entities.Kid.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kids"] });
      setForm({ name: "" });
      setDialogOpen(false);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim()) {
      addKid.mutate({ name: form.name });
    }
  }

  if (kidsLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Kids</h1>
            <p className="text-sm text-muted-foreground">
              Manage the kids in your household
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/chores">
              <Button variant="outline">Parent Dashboard</Button>
            </Link>
            <Link href="/rewards">
              <Button variant="outline">Rewards</Button>
            </Link>
            <Button
              onClick={() => setDialogOpen(true)}
              className="font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Kid
            </Button>
          </div>
        </div>

        {kids.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
            <h2 className="text-lg font-display font-bold mb-2">
              No kids yet!
            </h2>
            <p className="text-muted-foreground mb-6">
              Add your kids to get started with chores and rewards.
            </p>
            <Button onClick={() => setDialogOpen(true)}>Add Your First Kid</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kids.map((kid) => {
              const kidLogs = logs.filter((l) => l.kid_id === kid.id);
              const totalStars = kidLogs
                .filter((l) => l.status === "approved")
                .reduce((sum, l) => sum + l.star_value, 0);
              const pendingStars = kidLogs
                .filter((l) => l.status === "pending")
                .reduce((sum, l) => sum + l.star_value, 0);
              const kidRedemptions = redemptions.filter((r: any) => r.kid_id === kid.id);

              return (
                <div
                        key={kid.id}
                        className="card-accent rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                  <div className="flex items-center gap-4 mb-4">
                    <KidAvatar name={kid.name} size="lg" />
                    <div>
                      <h3 className="font-display font-bold">{kid.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {kidLogs.length} chores logged
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">
                          Total Stars
                        </span>
                      </div>
                      <span className="font-display font-bold text-lg">
                        {totalStars}
                      </span>
                    </div>

                    {pendingStars > 0 && (
                      <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-secondary" />
                          <span className="text-sm text-muted-foreground">
                            Pending
                          </span>
                        </div>
                        <Badge variant="secondary">{pendingStars}</Badge>
                      </div>
                    )}

                    {kidRedemptions.length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Recent Rewards</p>
                        <div className="space-y-2">
                          {kidRedemptions.slice(0, 2).map((r: any) => (
                            <div key={r.id} className="text-xs p-2 bg-primary/5 rounded">
                              <p className="font-semibold">{r.reward_title}</p>
                              <p className="text-muted-foreground">
                                {new Date(r.redeemed_date).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                          {kidRedemptions.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{kidRedemptions.length - 2} more reward{kidRedemptions.length - 2 === 1 ? "" : "s"}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground pt-2">
                      {kidLogs.length === 0
                        ? "No activity yet"
                        : `Last activity: ${new Date(
                            kidLogs[0].created_date
                          ).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add a Kid</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Kid's Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ name: e.target.value })}
                  placeholder="Enter kid's name"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!form.name.trim() || addKid.isPending}
                >
                  {addKid.isPending ? "Adding..." : "Add Kid"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
