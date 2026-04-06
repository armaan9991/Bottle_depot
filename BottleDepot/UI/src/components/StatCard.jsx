
const StatCard = ({
    label,
    value,
    sub,
    className,
    labelClassName,
    valueClassName,
    subClassName,
}) => {
    return (
        <div className={className} style={!className ? styles.card : undefined}>
            <div className={labelClassName} style={!labelClassName ? styles.label : undefined}>
                {label}
            </div>
            <div className={valueClassName} style={!valueClassName ? styles.value : undefined}>
                {value}
            </div>
            {sub && (
                <div className={subClassName} style={!subClassName ? styles.sub : undefined}>
                    {sub}
                </div>
            )}
        </div>
    );
};

const styles = {
    card:  { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px 20px' },
    label: { fontSize: '11px', fontWeight: '500', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' },
    value: { fontSize: '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px', lineHeight: '1', marginBottom: '4px' },
    sub:   { fontSize: '11px', color: '#94a3b8' },
};

export default StatCard;
