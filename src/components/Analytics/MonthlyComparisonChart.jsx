import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { calculateMonthlyIncomeVsExpense } from '../../utils/calculations';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { Icon } from '../common/Icons';

export const MonthlyComparisonChart = ({ transactions }) => {
  const [showTable, setShowTable] = useState(false);

  const monthlyData = useMemo(() => {
    return calculateMonthlyIncomeVsExpense(transactions, 6, new Date());
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const inc = payload.find((p) => p.dataKey === 'income')?.value || 0;
      const exp = payload.find((p) => p.dataKey === 'expenses')?.value || 0;
      const net = inc - exp;

      return (
        <div
          style={{
            backgroundColor: 'var(--chart-tooltip-bg)',
            border: '1px solid var(--chart-tooltip-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-primary)',
            fontSize: '0.8125rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '6px' }}>{label}</div>
          <div style={{ color: 'var(--income)', display: 'flex', justifyContent: 'space-between', gap: '14px' }}>
            <span>Inflow:</span> <strong>{formatCurrency(inc)}</strong>
          </div>
          <div style={{ color: 'var(--expense)', display: 'flex', justifyContent: 'space-between', gap: '14px', marginTop: '2px' }}>
            <span>Outflow:</span> <strong>{formatCurrency(exp)}</strong>
          </div>
          <div
            style={{
              marginTop: '6px',
              paddingTop: '6px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '14px',
              color: net >= 0 ? 'var(--income)' : 'var(--expense)',
              fontWeight: 700,
            }}
          >
            <span>Net Velocity:</span> <span>{formatCurrency(net)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pro-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Cash Flow Trends (6 Months)
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Monthly comparison of total income vs total expenditure
          </p>
        </div>

        <button
          onClick={() => setShowTable((prev) => !prev)}
          aria-label={showTable ? 'Show chart view' : 'Show accessible table view'}
          style={{
            padding: '5px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-input)',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background var(--transition-fast)',
          }}
        >
          <Icon name={showTable ? 'bar-chart' : 'list'} size={14} />
          <span>{showTable ? 'Chart View' : 'Table View'}</span>
        </button>
      </div>

      {showTable ? (
        /* Accessible Table Alternative */
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.8125rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 6px', fontWeight: 600 }}>Month</th>
                <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 600 }}>Income</th>
                <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 600 }}>Expenses</th>
                <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 600 }}>Net Savings</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row) => (
                <tr key={row.monthKey} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 6px', fontWeight: 600 }}>{row.label}</td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', color: 'var(--income)', fontFamily: 'var(--font-mono)' }}>
                    {formatCurrency(row.income)}
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', color: 'var(--expense)', fontFamily: 'var(--font-mono)' }}>
                    {formatCurrency(row.expenses)}
                  </td>
                  <td
                    style={{
                      padding: '10px 6px',
                      textAlign: 'right',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: row.netSavings >= 0 ? 'var(--income)' : 'var(--expense)',
                    }}
                  >
                    {formatCurrency(row.netSavings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Recharts Grouped Bar Chart */
        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis
                dataKey="label"
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-color)' }}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatCompactCurrency(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="income" name="Income" fill="var(--income)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--expense)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
