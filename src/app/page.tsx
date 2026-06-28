"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16 brand-gradient rounded-xl py-8 px-6">
          <h1 className="text-5xl sm:text-6xl font-display font-bold mb-4">
            ⭐ StarChore
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Encourage kids to complete chores and earn stars for amazing rewards
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-accent rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
            <h3 className="font-display font-bold text-lg mb-2">
              Parent Dashboard
            </h3>
            <p className="text-sm text-muted-foreground">
              Create and manage chores, assign them to kids, and track progress
              with ease.
            </p>
          </div>

          <div className="card-accent rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-display font-bold text-lg mb-2">
              Kid Interface
            </h3>
            <p className="text-sm text-muted-foreground">
              Kids can view assigned chores, mark them as complete, and watch
              their stars grow.
            </p>
          </div>

          <div className="card-accent rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🎁</div>
            <h3 className="font-display font-bold text-lg mb-2">
              Reward System
            </h3>
            <p className="text-sm text-muted-foreground">
              Set up rewards that kids can redeem with their earned stars—
              motivation made fun!
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chores">
            <Button size="lg" className="font-semibold">
              Parent Dashboard →
            </Button>
          </Link>
          <Link href="/kids">
            <Button size="lg" variant="outline" className="font-semibold">
              Kid View →
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-display font-bold text-primary mb-2">
              ∞
            </div>
            <p className="text-muted-foreground">
              Unlimited Chores & Tasks
            </p>
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-primary mb-2">
              ⭐
            </div>
            <p className="text-muted-foreground">Earn Stars for Completion</p>
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-primary mb-2">
              🎯
            </div>
            <p className="text-muted-foreground">Track Goals & Rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
