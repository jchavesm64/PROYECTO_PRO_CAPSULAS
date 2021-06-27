import React, { useState } from 'react'
import CardUsuarios from '../usuarios/Card'
import Pagination from '../shared/Pagination'

const DataGrid = ({ ...props }) => {
    const { data, type, displayLength } = props;
    var index = 0
    const [page, setPage] = useState(1);

    const getData = () => {
        var array = [], size = data.length;
        if (index + displayLength <= data.length) {
            size = index + displayLength;
        }
        for (var i = index; i < size; i++) {
            array.push(<CardUsuarios usuario={data[i]} {...props} />)
        }
        return array
    }

    const calIndex = () => {
        if(page === 1){
            index = 0
        }else{
            index = (((page - 1) * displayLength) + 1)
        }
    }

    calIndex()

    return (
        <div className="bg-white rounded shadow">
            <div className="d-flex flex-wrap justify-content-around col-xs">
                {
                    getData()
                }
            </div>
            {(data.length > displayLength) &&
                <div div className="d-flex justify-content-end w-90">
                    <Pagination length={data.length} displayLength={displayLength} activePage={page} setPage={setPage}/>
                </div>
            }
        </div >
    )
}

export default DataGrid