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
        width: 250,
        height: 300,
        boxShadow: "1px 1px 10px 1px #ccc"
    },
    title: {
        padding: "0.5em",
        fontSize: "16px",
        fontWeight: "bold"
    },
    scrollList: {
        height: 200,
        overflow: "auto"
    },
    list: {
        padding: "8px 16px"
    },
    listItem: {
        textAlign: "left",
        padding: "0.5em",
        display: "flex",
        flexWrap: "no-wrap"
    },
    itemLabel: {
        display: "block",
        marginLeft: "8px"
    }
}

export default (props) => {
    const { title, initialData, data, setDataFunction, destructFunction } = props;
    const { functions } = useSelector(state => state)
    const { removeVietnameseTones } = functions;

    const [filter, setFilter] = useState("")

    const filteringOptions = (e) => {
        setFilter(removeVietnameseTones(e.target.value))
    }

    const renderFilter = () => {
        if (filter == undefined || filter == "") {
            return data;
        } else {
            const filtedData = data.filter(record => {
                const plainText = removeVietnameseTones(record.label?.toLowerCase())
                return plainText.includes(filter)
            })
            return filtedData
        }
    }

    const addOrRemoveFilter = (item) => {
        setDataFunction(item)
    }

    const isChecked = (item) => {
        const filtedItem = initialData.find(data => data.id == item.id)
        return filtedItem
    }

    return (
        <div className="bg-white " style={styles.container}>
            <div style={styles.header}>
                <h6 style={styles.title}>{title}</h6>
                <i
                    className="fa fa-close"
                    style={styles.close}
                    onClick={destructFunction}
                />
            </div>
            <div className="search">
                <div style={styles.list}>
                    <input type="search" id="form1" class="form-control" onChange={filteringOptions} />
                </div>
            </div>
            <div style={styles.scrollList}>
                <ul style={styles.list}>
                    {data && renderFilter().map(item =>
                        <li key={item.id} style={styles.listItem} onClick={() => { addOrRemoveFilter(item) }}>

                                {isChecked(item) ?
                                    <input type="checkbox" onClick={() => { addOrRemoveFilter(item) }}
                                        checked
                                    />
                                    :
                                    <input type="checkbox" onClick={() => { addOrRemoveFilter(item) }} />
                                }
                            <label >
                                <span style={styles.itemLabel}>{item.label}</span>
                            </label>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}