import '../components/OrderInformation.css';

export default function OrderInformation({ changeAllBox, checkList, numberOfBread}){

    
    return(
        <div className="orderInformation">
        <input type="checkbox" 
        onChange={e => changeAllBox(e.target.checked)} 
        checked={checkList.length === numberOfBread ? true : false} />
        </div>
    );
}