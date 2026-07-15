"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Linkedin,
  Twitter,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { FadeUp, Stagger } from "@/components/shared/motion";
import { cn } from "@/lib/utils";
import type { OutputFormat } from "@/lib/constants/formats";

interface AnalyticsData {
  totalGenerations: number;
  formatBreakdown: Record<OutputFormat, number>;
  estimatedReach: string;
  engagementRate: string;
  topFormat: string | null;
}

const formatIcons: Record<string, typeof Linkedin> = {
  linkedin_post: Linkedin,
  linkedin_carousel: Layers,
  twitter_thread: Twitter,
};

const formatColors: Record<string, string> = {
  linkedin_post: "text-blue-600 bg-blue-50",
  linkedin_carousel: "text-purple-600 bg-purple-50",
  twitter_thread: "text-sky-500 bg-sky-50",
};

const formatLabels: Record<string, string> = {
  linkedin_post: "LinkedIn Post",
  linkedin_carousel: "Carousel",
  twitter_thread: "X Thread",
};

// TODO: Replace with real analytics API endpoint
const ESTIMATED_REACH_PER_POST = 1250;
const ESTIMATED_ENGAGEMENT_RATE = 3.8;

export function AnalyticsWidget() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/generations?limit=100");
        const json = await res.json();
        const generations: { output_format: OutputFormat }[] = json.data || [];

        const total = generations.length;
        const breakdown: Record<OutputFormat, number> = {
          linkedin_post: 0,
          linkedin_carousel: 0,
          twitter_thread: 0,
        };

        for (const gen of generations) {
          if (breakdown[gen.output_format] !== undefined) {
            breakdown[gen.output_format]++;
          }
        }

        const formatEntries = Object.entries(breakdown) as [OutputFormat, number][];
        const topFormat = formatEntries.sort((a, b) => b[1] - a[1])[0];

        setData({
          totalGenerations: total,
          formatBreakdown: breakdown,
          estimatedReach: total > 0 ? `${(total * ESTIMATED_REACH_PER_POST).toLocaleString()}` : "0",
          engagementRate: total > 0 ? `${ESTIMATED_ENGAGEMENT_RATE}%` : "0%",
          topFormat: topFormat && topFormat[1] > 0 ? topFormat[0] : null,
        });
      } catch {
        setData({
          totalGenerations: 0,
          formatBreakdown: { linkedin_post: 0, linkedin_carousel: 0, twitter_thread: 0 },
          estimatedReach: "0",
          engagementRate: "0%",
          topFormat: null,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4 text-brand-600" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-7 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const formatEntries = Object.entries(data.formatBreakdown) as [OutputFormat, number][];

  return (
    <FadeUp as="div">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4 text-brand-600" />
            Analytics
          </CardTitle>
          {data.totalGenerations > 0 && (
            <span className="text-[10px] text-text-muted">
              Estimated metrics
            </span>
          )}
        </CardHeader>
        <CardContent>
          {data.totalGenerations === 0 ? (
            <EmptyState
              icon={<TrendingUp className="h-6 w-6" />}
              title="No data yet"
              description="Generate content to see analytics and insights."
            />
          ) : (
            <Stagger className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted">Total Posts</p>
                  <p className="text-2xl font-bold text-text-primary">{data.totalGenerations}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Est. Reach</p>
                  <p className="text-2xl font-bold text-text-primary">{data.estimatedReach}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Engagement Rate</p>
                  <p className="text-2xl font-bold text-green-600">{data.engagementRate}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Top Format</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {data.topFormat ? formatLabels[data.topFormat] || "—" : "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-text-muted">By format</p>
                {formatEntries.map(([format, count]) => {
                  const maxCount = Math.max(...formatEntries.map(([, c]) => c), 1);
                  const pct = Math.round((count / maxCount) * 100);
                  const Icon = formatIcons[format] || Linkedin;
                  return (
                    <div key={format} className="flex items-center gap-3">
                      <div className={cn("flex h-7 w-7 items-center justify-center rounded-full", formatColors[format])}>
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-text-primary">
                            {formatLabels[format] || format}
                          </span>
                          <span className="text-xs text-text-muted">{count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                          <div
                            className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Stagger>
          )}
        </CardContent>
      </Card>
    </FadeUp>
  );
}
