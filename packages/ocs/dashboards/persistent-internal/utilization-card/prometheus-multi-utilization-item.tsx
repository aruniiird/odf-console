import * as React from 'react';
import { getRangeVectorStats } from '@odf/shared/charts';
import {
  useCustomPrometheusPoll,
  usePrometheusBasePath,
} from '@odf/shared/hooks/custom-prometheus-poll';
import { Humanize } from '@openshift-console/dynamic-plugin-sdk';
import { useUtilizationDuration } from '@openshift-console/dynamic-plugin-sdk-internal';
import { MultilineUtilizationItem } from './multi-utilization-item';

export const PrometheusMultilineUtilizationItem: React.FC<PrometheusMultilineUtilizationItemProps> =
  ({ queries, chartType, title, humanizeValue }) => {
    const { duration } = useUtilizationDuration();
    // eslint-disable-next-line consistent-return
    const trimSecondsXMutator = (x: number) => {
      const d = new Date(x * 1000);
      d.setSeconds(0, 0);
      return d;
    };

    const [stats, setStats] = React.useState([]);

    const [queryA, queryB] = queries;

    const [firstMetric, firstMetricError, firstMetricLoading] =
      useCustomPrometheusPoll({
        query: queryA.query,
        endpoint: 'api/v1/query_range' as any,
        timespan: duration,
        basePath: usePrometheusBasePath(),
      });
    const [secondMetric, secondMetricError, secondMetricLoading] =
      useCustomPrometheusPoll({
        query: queryB?.query,
        endpoint: 'api/v1/query_range' as any,
        timespan: duration,
        basePath: usePrometheusBasePath(),
      });

    const hasError = firstMetricError || secondMetricError;
    const isLoading = firstMetricLoading || secondMetricLoading;

    React.useEffect(() => {
      let tempStats = [];
      if (!firstMetricError && !firstMetricLoading) {
        const statsA =
          getRangeVectorStats(
            firstMetric,
            queryA.desc,
            null,
            trimSecondsXMutator
          )?.[0] || [];
        tempStats = [statsA];
      }
      if (!secondMetricError && !secondMetricLoading) {
        const statsB =
          getRangeVectorStats(
            secondMetric,
            queryB?.desc,
            null,
            trimSecondsXMutator
          )?.[0] || [];
        tempStats = [...tempStats, statsB];
      }
      if (JSON.stringify(stats) !== JSON.stringify(tempStats)) {
        setStats(tempStats);
      }
    }, [
      stats,
      setStats,
      firstMetric,
      firstMetricError,
      firstMetricLoading,
      secondMetric,
      secondMetricError,
      secondMetricLoading,
      queryA.desc,
      queryB?.desc,
    ]);

    return (
      <MultilineUtilizationItem
        title={title}
        data={stats}
        error={hasError}
        isLoading={isLoading}
        humanizeValue={humanizeValue}
        queries={queries}
        chartType={chartType}
      />
    );
  };

type PrometheusCommonProps = {
  title: string;
  humanizeValue: Humanize;
  namespace?: string;
  isDisabled?: boolean;
};

type QueryWithDescription = {
  query: string;
  desc: string;
};

type PrometheusMultilineUtilizationItemProps = PrometheusCommonProps & {
  queries: [QueryWithDescription, QueryWithDescription];
  chartType?: 'stacked-area' | 'grouped-line';
};
