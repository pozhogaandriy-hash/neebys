'use client';

import {
  useEffect,
  useState,
} from 'react';

import { AdminLayout } from '@/components/AdminLayout';
import {
  headingFont,
  bodyFont,
} from '@/app/fonts';

type AnalyticsData = {
  stats: {
    totalSessions: number;
    uniqueVisitors: number;
    avgSessionDuration: string;
    bounceRate: number;
  };

  sessionsByDay: {
    date: string;
    sessions: number;
  }[];

  topPages: {
    path: string;
    views: number;
    sessions: number;
  }[];

  trafficSources: {
    source: string;
    sessions: number;
    pct: number;
  }[];
};

function BarChart({
  data,
  height = 120,
}: {
  data: {
    date: string;
    sessions: number;
  }[];

  height?: number;
}) {
  if (!data.length) {
    return (
      <div
        className={`${bodyFont.className} text-sm text-[#555555] flex items-center justify-center`}
        style={{
          height: `${height}px`,
        }}
      >
        No data yet
      </div>
    );
  }

  const max = Math.max(
    ...data.map(
      (item) => item.sessions
    ),
    1
  );

  return (
    <div
      className="flex items-end gap-2"
      style={{
        height: `${height}px`,
      }}
    >
      {data.map((item) => {
        const date =
          new Date(
            item.date
          );

        const label =
          date.toLocaleDateString(
            'en-US',
            {
              weekday: 'short',
            }
          );

        return (
          <div
            key={item.date}
            className="flex flex-col items-center gap-1 flex-1 group"
          >
            <div className="relative w-full">
              <div
                className="w-full bg-[#1A1A1A] group-hover:bg-[#2A2A2A] transition-colors"
                style={{
                  height: `${Math.max(
                    (item.sessions /
                      max) *
                      (height - 25),
                    item.sessions > 0
                      ? 4
                      : 0
                  )}px`,
                }}
              />

              <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span
                  className={`${bodyFont.className} text-[9px] text-white whitespace-nowrap`}
                >
                  {item.sessions.toLocaleString()}
                </span>
              </div>
            </div>

            <span
              className={`${bodyFont.className} text-[10px] text-[#333333]`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [
    analytics,
    setAnalytics,
  ] =
    useState<AnalyticsData | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    range,
    setRange,
  ] = useState('7d');

  useEffect(() => {
    const loadAnalytics =
      async () => {
        try {
          setLoading(true);

          const response =
            await fetch(
              `/api/admin/analytics?range=${range}`,
              {
                cache: 'no-store',
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                'Failed to load analytics'
            );
          }

          setAnalytics(data);
        } catch (error) {
          console.error(
            'Analytics error:',
            error
          );

          setAnalytics(null);
        } finally {
          setLoading(false);
        }
      };

    loadAnalytics();
  }, [range]);

  const stats =
    analytics?.stats;

  return (
    <AdminLayout
      title="Analytics"
      breadcrumb={[
        {
          label: 'Admin',
          href: '/admin',
        },
        {
          label: 'Analytics',
        },
      ]}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className={`${headingFont.className} text-lg text-white font-semibold`}
          >
            Website Analytics
          </h1>

          <p
            className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}
          >
            Real website traffic
          </p>
        </div>

        <select
          value={range}
          onChange={(e) =>
            setRange(
              e.target.value
            )
          }
          className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none`}
        >
          <option value="7d">
            Last 7 days
          </option>

          <option value="30d">
            Last 30 days
          </option>

          <option value="90d">
            Last 90 days
          </option>

          <option value="all">
            All time
          </option>
        </select>
      </div>

      {/* KPI */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          {
            label:
              'Total Sessions',

            value: loading
              ? '...'
              : (
                  stats?.totalSessions ??
                  0
                ).toLocaleString(),

            delta:
              'Real data',
          },

          {
            label:
              'Unique Visitors',

            value: loading
              ? '...'
              : (
                  stats?.uniqueVisitors ??
                  0
                ).toLocaleString(),

            delta:
              'Real data',
          },

          {
            label:
              'Avg. Session Duration',

            value: loading
              ? '...'
              : stats
                  ?.avgSessionDuration ??
                '0m 00s',

            delta:
              'Calculated',
          },

          {
            label:
              'Bounce Rate',

            value: loading
              ? '...'
              : `${Number(
                  stats?.bounceRate ??
                    0
                ).toFixed(1)}%`,

            delta:
              'Calculated',
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-[#0A0A0A] border border-[#111111] p-5"
          >
            <p
              className={`${bodyFont.className} text-[#555555] text-xs mb-3`}
            >
              {kpi.label}
            </p>

            <p
              className={`${headingFont.className} text-2xl font-semibold text-white`}
            >
              {kpi.value}
            </p>

            <p
              className={`${bodyFont.className} text-xs mt-1 text-[#555555]`}
            >
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>

      {/* CHART */}

      <div className="bg-[#0A0A0A] border border-[#111111] p-6 mb-4">
        <h2
          className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-6`}
        >
          Sessions by Day
        </h2>

        <BarChart
          data={
            analytics
              ?.sessionsByDay ??
            []
          }
          height={120}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* TOP PAGES */}

        <div className="bg-[#0A0A0A] border border-[#111111] p-5">
          <h2
            className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-4`}
          >
            Top Pages
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0F0F0F]">
                {[
                  'Page',
                  'Views',
                  'Sessions',
                ].map((header) => (
                  <th
                    key={header}
                    className={`${headingFont.className} text-left text-[9px] uppercase tracking-[0.1em] text-[#2A2A2A] pb-2 font-normal`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#0D0D0D]">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-6 text-center text-[#555555]"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                (
                  analytics
                    ?.topPages ??
                  []
                ).map((page) => (
                  <tr
                    key={page.path}
                    className="hover:bg-[#0D0D0D] transition-colors"
                  >
                    <td
                      className={`${bodyFont.className} text-sm text-[#767676] py-2.5 font-mono`}
                    >
                      {page.path}
                    </td>

                    <td
                      className={`${bodyFont.className} text-sm text-white py-2.5`}
                    >
                      {page.views.toLocaleString()}
                    </td>

                    <td
                      className={`${bodyFont.className} text-sm text-[#555555] py-2.5`}
                    >
                      {page.sessions.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading &&
            !analytics?.topPages
              .length && (
              <p className="text-sm text-[#555555] py-5">
                No page views yet.
              </p>
            )}
        </div>

        {/* TRAFFIC SOURCES */}

        <div className="bg-[#0A0A0A] border border-[#111111] p-5">
          <h2
            className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-4`}
          >
            Traffic Sources
          </h2>

          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-sm text-[#555555]">
                Loading...
              </p>
            ) : (
              (
                analytics
                  ?.trafficSources ??
                []
              ).map(
                (source) => (
                  <div
                    key={
                      source.source
                    }
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`${bodyFont.className} text-sm text-[#767676]`}
                      >
                        {
                          source.source
                        }
                      </span>

                      <span
                        className={`${bodyFont.className} text-sm text-white`}
                      >
                        {source.sessions.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full h-1 bg-[#111111]">
                      <div
                        className="h-full bg-[#333333]"
                        style={{
                          width: `${source.pct}%`,
                        }}
                      />
                    </div>

                    <p
                      className={`${bodyFont.className} text-[10px] text-[#333333] mt-0.5`}
                    >
                      {source.pct}% of total
                    </p>
                  </div>
                )
              )
            )}
          </div>

          {!loading &&
            !analytics
              ?.trafficSources
              .length && (
              <p className="text-sm text-[#555555] py-5">
                No traffic data yet.
              </p>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
