import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, AreaChart, Area, ComposedChart, ScatterChart, Scatter } from 'recharts';
export default (props) => {
    const { lang, proxy, auth } = useSelector(state => state);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff4263'];

    const MyPieChart = () => {
        const uis_temp = [
            {
                "id": 1,
                "data": lang["data"] + " 1"
            },
            {
                "id": 2,
                "data": lang["data"] + " 2"
            },
            {
                "id": 3,
                "data": lang["data"] + " 3"
            },
            {
                "id": 4,
                "data": lang["data"] + " 4"
            },
            {
                "id": 5,
                "data": lang["data"] + " 5"
            }
        ];

        let pieData = [];

        if (uis_temp.length < 10) {
            pieData = uis_temp.map(item => ({
                name: item.data,
                value: item.id,
            }));
        }

        return (
            <ResponsiveContainer className="pie-chart-container">
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        fill="#8884d8"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    {/* <Legend
                    verticalAlign="bottom"
                    height={60}
                    wrapperStyle={{ paddingBottom: '5px' }}
                    iconType="circle"
                    align="center"
                /> */}
                    <Tooltip
                        content={({ payload }) => {
                            if (payload && payload.length > 0) {
                                return (
                                    <div className="custom-tooltip">
                                        <p>{`${payload[0].name} : ${payload[0].value.toFixed()}`}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    };
}
