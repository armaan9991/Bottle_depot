export default function StatusBadge ({ status })  {
    const map = {
        Done:      { bg: '#e6f4ea', color: '#1e7e34' },
        Pending:   { bg: '#fff8e1', color: '#856404' },
        Active:    { bg: '#e6f4ea', color: '#1e7e34' },
        Available: { bg: '#e6f4ea', color: '#1e7e34' },
        Busy:      { bg: '#fff8e1', color: '#856404' },
        Closed:    { bg: '#f0f0f0', color: '#666'    },
        Shipped:   { bg: '#e6f1fb', color: '#0c447c' },
        Upcoming:  { bg: '#e6f1fb', color: '#0c447c' },
        Admin:     { bg: '#EEEDFE', color: '#3C3489' },
        Employee:  { bg: '#E1F5EE', color: '#085041' },
        Open:      { bg: '#fff8e1', color: '#856404' },
    };

    const s = map[status] || { bg: '#f0f0f0', color: '#666' };

    return (
        <span style={{
            fontSize: '11px', padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: s.bg,
            color: s.color,
        }}>
            {status}
        </span>
    );
};