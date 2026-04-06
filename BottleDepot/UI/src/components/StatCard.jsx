export default function StatCard({label ,value,sub}){
    <div>
        <div>{label}</div>
        <div>{value}</div>
        {sub && <div>{sub} </div>}
    </div>
}