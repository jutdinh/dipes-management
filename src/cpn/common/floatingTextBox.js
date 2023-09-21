import { useSelector } from "react-redux";
import { useState } from 'react';
const styles = {
    header: {
        position: "relative"
    },

    close: {
        display: "block",
        position: "absolute",
        right: "0.5em",
        top: "0.5em",
        fontSize: 20,
        color: "#ff6655",
        cursor: "pointer",
    },

    container: {
        width: 300, 
        padding: "0.5em",
        boxShadow: "1px 1px 10px 1px #ccc",
        
    },
    title: {
        padding: "0.5em",
        fontSize: "16px",
        fontWeight: "bold"
    }    
}


export default (props) => {
    const { title, initialData,  setDataFunction, destructFunction } = props;
    const { functions } = useSelector(state => state)
    const { removeVietnameseTones }  = functions;

    const changeTrigger = (e) => {       
        setDataFunction(e)
    }

    const catchEnter = (e) => {
        if( e.keyCode == 13 ){
            destructFunction()
        }
    }

    return (
        <div className="bg-white " style={ styles.container }>
            <div style={ styles.header }>
                <h6 style={ styles.title }>{ title }</h6>
                <i 
                    className="fa fa-close" 
                    style={ styles.close } 
                    onClick = { destructFunction }
                />
            </div>
            <div className="search">
                <div style={ styles.list }>
                    <input type="search" id="form1" class="form-control" 
                        value={ initialData } 
                        onChange={ changeTrigger }
                        onKeyUp={ catchEnter }
                    />                                        
                </div>
            </div>
            
        </div>
    )
}