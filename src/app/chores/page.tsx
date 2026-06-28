"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Star, Pencil, Trash2, Play, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/EmptyState";
import KidAvatar from "@/components/KidAvatar";
import Link from "next/link";
import { useState } from "react";

const FREQ_LABELS = { daily: "Daily", weekly: "Weekly", "one-time": "One-time" };

export default function Chores() {
  const queryClient = useQueryClient();
  const { data: chores = [], isLoading } = useQuery({ queryKey: ["chores"], queryFn: () => base44.entities.Chore.list() });
  const { data: kids = [] } = useQuery({ queryKey: ["kids"], queryFn: () => base44.entities.Kid.list() });
  const { data: logs = [] } = useQuery({ queryKey: ["choreLogs"], queryFn: () => base44.entities.ChoreLog.list("-created_date", 100) });

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const pendingChoreIds = new Set(
    logs
      .filter((l) => {
        if (l.status !== "pending") return false;
        const chore = chores.find((c) => c.id === l.chore_id);
        if (!chore) return true;
        const logDate = l.completed_date || l.created_date;
        if (chore.frequency === "daily") return logDate >= startOfToday;
        if (chore.frequency === "weekly") return logDate >= startOfWeek;
        return true;
      })
      .map((l) => l.chore_id)
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", star_value: 1, frequency: "daily", assigned_to: "" });

  const save = useMutation({
    mutationFn: (data: any) => {
      const kid = kids.find((k) => k.id === data.assigned_to);
      const payload = { ...data, assigned_to_name: kid?.name || "" };
      return editing ? base44.entities.Chore.update(editing.id, payload) : base44.entities.Chore.create(payload);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["chores"] }); closeDialog(); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => base44.entities.Chore.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["chores"] }); setDeleteId(null); },
  });

  const logChore = useMutation({
    mutationFn: async (chore: any) => {
      await base44.entities.ChoreLog.create({
        chore_id: chore.id, chore_title: chore.title, kid_id: chore.assigned_to,
        kid_name: chore.assigned_to_name, star_value: chore.star_value, status: "pending",
        started_date: new Date().toISOString(),
        completed_date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["choreLogs"] });
    },
  });

  const approveChore = useMutation({
    mutationFn: (logId: string) => base44.entities.ChoreLog.update(logId, { status: "approved" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["choreLogs"] });
    },
  });

  const rejectChore = useMutation({
    mutationFn: (logId: string) => base44.entities.ChoreLog.update(logId, { status: "rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["choreLogs"] });
    },
  });

  function openCreate() {
    setEditing(null);
    setForm({ title: "", description: "", star_value: 1, frequency: "daily", assigned_to: "" });
    setDialogOpen(true);
  }

  function openEdit(chore: any) {
    setEditing(chore);
    setForm({ title: chore.title, description: chore.description || "", star_value: chore.star_value, frequency: chore.frequency, assigned_to: chore.assigned_to });
    setDialogOpen(true);
  }

  function closeDialog() { setDialogOpen(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate({ ...form, star_value: Number(form.star_value) });
  }

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Chores</h1>
            <p className="text-sm text-muted-foreground">Create and manage chores for your kids</p>
          </div>
          <div className="flex gap-2">
            <Link href="/kids"><Button variant="outline">Kid View</Button></Link>
            <Button onClick={openCreate} className="font-semibold gap-2" disabled={kids.length === 0}>
              <Plus className="h-4 w-4" />Add Chore
            </Button>
          </div>
        </div>

        {kids.length === 0 && (
          <div className="bg-secondary/50 rounded-xl p-4 text-sm text-muted-foreground text-center mb-8">
            Add kids first before creating chores.
          </div>
        )}

        {chores.length === 0 ? (
          <EmptyState title="No chores yet!" description="Create chores and assign them to your kids to start earning stars." actionLabel={kids.length > 0 ? "Create First Chore" : undefined} onAction={openCreate} />
        ) : (
          <>
          <div className="card-accent rounded-xl border border-border shadow-sm overflow-hidden">
            {chores.map((chore, idx) => (
              <div key={chore.id} className={`flex items-center gap-4 px-5 py-4 group hover:bg-muted/40 transition-colors ${idx !== 0 ? "border-t border-border" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-sm">{chore.title}</span>
                    <Badge variant="outline" className="text-xs">{FREQ_LABELS[chore.frequency as keyof typeof FREQ_LABELS] || chore.frequency}</Badge>
                  </div>
                  {chore.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{chore.description}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <KidAvatar name={chore.assigned_to_name || "?"} size="sm" />
                  <span className="text-sm text-muted-foreground hidden sm:inline">{chore.assigned_to_name}</span>
                </div>
                <Badge variant="secondary" className="font-semibold gap-1 shrink-0">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{chore.star_value}
                </Badge>
                <Button
                  size="sm"
                  variant={pendingChoreIds.has(chore.id) ? "secondary" : "outline"}
                  className="gap-1 text-xs shrink-0"
                  onClick={() => logChore.mutate(chore)}
                  disabled={pendingChoreIds.has(chore.id)}
                >
                  <Play className="h-3 w-3" />
                  {pendingChoreIds.has(chore.id) ? "Pending..." : "Done"}
                </Button>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(chore)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(chore.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>

          {logs.filter((l) => l.status === "pending").length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-display font-bold mb-6">Pending Approvals</h2>
              <div className="space-y-3">
                {logs
                  .filter((l) => l.status === "pending")
                  .map((log) => (
                    <div key={log.id} className="card-accent rounded-lg p-4 border border-border flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <KidAvatar name={log.kid_name} size="sm" />
                          <p className="font-semibold">{log.kid_name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.chore_title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Completed: {new Date(log.completed_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="secondary" className="font-semibold gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {log.star_value}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => approveChore.mutate(log.id)}
                          disabled={approveChore.isPending || rejectChore.isPending}
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => rejectChore.mutate(log.id)}
                          disabled={approveChore.isPending || rejectChore.isPending}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          </>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Chore" : "Create a Chore"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Stars Earned *</Label><Input type="number" value={form.star_value} onChange={(e) => setForm({ ...form, star_value: e.target.value })} min={1} required /></div>
                <div>
                  <Label>Frequency</Label>
                  <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Assign To *</Label>
                <Select value={form.assigned_to} onValueChange={(v) => setForm({ ...form, assigned_to: v })}>
                  <SelectTrigger><SelectValue placeholder="Select a kid" /></SelectTrigger>
                  <SelectContent>
                    {kids.map((kid) => <SelectItem key={kid.id} value={kid.id}>{kid.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={!form.title || !form.assigned_to || save.isPending}>{save.isPending ? "Saving..." : editing ? "Save Changes" : "Create Chore"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this chore?</AlertDialogTitle>
              <AlertDialogDescription>This chore will be permanently removed.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
