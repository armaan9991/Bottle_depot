
const STATUS_MAP = {
    Done:      { bg: '#ecfdf5', color: '#059669', border: 'rgba(5,150,105,0.15)'  },
    Pending:   { bg: '#fffbeb', color: '#d97706', border: 'rgba(217,119,6,0.15)'  },
    Active:    { bg: '#ecfdf5', color: '#059669', border: 'rgba(5,150,105,0.15)'  },
    Available: { bg: '#ecfdf5', color: '#059669', border: 'rgba(5,150,105,0.15)'  },
    Busy:      { bg: '#fffbeb', color: '#d97706', border: 'rgba(217,119,6,0.15)'  },
    Closed:    { bg: '#f1f5f9', color: '#64748b', border: 'rgba(100,116,139,0.15)'},
    Shipped:   { bg: '#eff6ff', color: '#2563eb', border: 'rgba(37,99,235,0.15)'  },
    Upcoming:  { bg: '#eff6ff', color: '#2563eb', border: 'rgba(37,99,235,0.15)'  },
    Admin:     { bg: '#eff6ff', color: '#2563eb', border: 'rgba(37,99,235,0.15)'  },
    Employee:  { bg: '#ecfdf5', color: '#059669', border: 'rgba(5,150,105,0.15)'  },
    Open:      { bg: '#fffbeb', color: '#d97706', border: 'rgba(217,119,6,0.15)'  },
};

const StatusBadge = ({ status, className }) => {
    const s = STATUS_MAP[status] || { bg: '#f1f5f9', color: '#64748b', border: 'rgba(100,116,139,0.15)' };

    return (
        <span
            className={className}
            style={{
                fontSize:        '10px',
                fontWeight:      '600',
                padding:         '3px 9px',
                borderRadius:    '20px',
                backgroundColor: s.bg,
                color:           s.color,
                border:          `1px solid ${s.border}`,
                textTransform:   'uppercase',
                letterSpacing:   '0.04em',
                whiteSpace:      'nowrap',
                display:         'inline-block',
            }}
        >
            {status}
        </span>
    );
};

export default StatusBadge;
