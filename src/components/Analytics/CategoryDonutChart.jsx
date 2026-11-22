import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateSpendingByCategory } from '../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Icon } from '../common/Icons';

export const CategoryDonutChart = ({ transactions, timeframe = 'this-month' }) => {
  const [showTable, setShowTable] = useState(false);

  const data = useMemo(() => {
    return calculateSpendingByCategory(transactions, timeframe);
  }, [transactions, timeframe]);

  const totalExpense = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
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
          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                backgroundColor: item.color,
                display: 'inline-block',
              }}
            />
            {item.name}
          </div>
          <div style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
            Spent: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{formatCurrency(item.value)}</strong>
          </div>
          <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
            Percentage: <strong>{formatPercentage(item.percentage)}</strong>
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
            Spending Allocation
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Category expenditure ({formatCurrency(totalExpense)} total)
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
          <Icon name={showTable ? 'pie-chart' : 'list'} size={14} />
          <span>{showTable ? 'Chart View' : 'Table View'}</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          <Icon name="pie-chart" size={38} color="var(--text-muted)" />
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
            No expense records in this timeframe
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Add an expense or load sample data to see the visual breakdown.
          </p>
        </div>
      ) : showTable ? (
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
                <th style={{ padding: '10px 6px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 600 }}>Share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '3px',
                        backgroundColor: item.color,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {formatCurrency(item.value)}
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {formatPercentage(item.percentage)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Recharts Donut Chart */
        <div style={{ position: 'relative', width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={2}
                stroke="var(--bg-surface)"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Callout */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Spent
            </div>
            <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(totalExpense)}
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown Pills */}
      {!showTable && data.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 12px',
            marginTop: '1rem',
            paddingTop: '0.875rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            justifyContent: 'center',
          }}
        >
          {data.slice(0, 6).map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                }}
              />
              <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{item.name}</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatPercentage(item.percentage)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
